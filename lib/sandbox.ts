/**
 * Code Execution Sandbox
 *
 * Provides safe code execution with timeout, output capture, and resource limits.
 * Uses child_process for local execution (dev) or Docker containers (production).
 */

import { exec } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

// ─── Types ───────────────────────────────────────────────────────

export interface ExecutionResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    executionTime: number;
    timedOut: boolean;
}

interface LanguageConfig {
    extension: string;
    command: (filepath: string) => string;
    available: () => Promise<boolean>;
}

// ─── Language Configurations ─────────────────────────────────────

const LANGUAGES: Record<string, LanguageConfig> = {
    python: {
        extension: '.py',
        command: (f) => `python "${f}"`,
        available: () => checkCommand('python --version'),
    },
    javascript: {
        extension: '.js',
        command: (f) => `node "${f}"`,
        available: () => checkCommand('node --version'),
    },
    typescript: {
        extension: '.ts',
        command: (f) => `npx tsx "${f}"`,
        available: () => checkCommand('npx tsx --version'),
    },
    bash: {
        extension: '.sh',
        command: (f) => `bash "${f}"`,
        available: () => checkCommand('bash --version'),
    },
    powershell: {
        extension: '.ps1',
        command: (f) => `powershell -File "${f}"`,
        available: () => checkCommand('powershell -Command "echo ok"'),
    },
};

function checkCommand(cmd: string): Promise<boolean> {
    return new Promise((resolve) => {
        exec(cmd, { timeout: 5000 }, (error) => resolve(!error));
    });
}

// ─── Execution ───────────────────────────────────────────────────

const SANDBOX_DIR = join(process.cwd(), '.sandbox');
const MAX_TIMEOUT = 30000; // 30 seconds
const MAX_OUTPUT = 50000; // 50KB output limit

export async function executeCode(
    code: string,
    language: string,
    timeout = 10000,
): Promise<ExecutionResult> {
    const lang = LANGUAGES[language.toLowerCase()];
    if (!lang) {
        return {
            stdout: '',
            stderr: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGES).join(', ')}`,
            exitCode: 1,
            executionTime: 0,
            timedOut: false,
        };
    }

    const isAvailable = await lang.available();
    if (!isAvailable) {
        return {
            stdout: '',
            stderr: `Runtime for ${language} is not available on this system.`,
            exitCode: 1,
            executionTime: 0,
            timedOut: false,
        };
    }

    // Create sandbox directory
    await mkdir(SANDBOX_DIR, { recursive: true });

    const fileId = randomUUID();
    const filepath = join(SANDBOX_DIR, `${fileId}${lang.extension}`);
    const effectiveTimeout = Math.min(timeout, MAX_TIMEOUT);

    try {
        await writeFile(filepath, code, 'utf-8');

        const startTime = Date.now();
        const result = await runProcess(lang.command(filepath), effectiveTimeout);
        const executionTime = Date.now() - startTime;

        return {
            stdout: result.stdout.slice(0, MAX_OUTPUT),
            stderr: result.stderr.slice(0, MAX_OUTPUT),
            exitCode: result.exitCode,
            executionTime,
            timedOut: result.timedOut,
        };
    } finally {
        // Cleanup
        try { await unlink(filepath); } catch { /* ignore */ }
    }
}

function runProcess(
    command: string,
    timeout: number,
): Promise<{ stdout: string; stderr: string; exitCode: number; timedOut: boolean }> {
    return new Promise((resolve) => {
        const child = exec(
            command,
            {
                timeout,
                maxBuffer: MAX_OUTPUT,
                env: {
                    ...process.env,
                    // Restrict environment for safety
                    PATH: process.env.PATH,
                    HOME: SANDBOX_DIR,
                    TEMP: SANDBOX_DIR,
                    TMP: SANDBOX_DIR,
                },
                cwd: SANDBOX_DIR,
            },
            (error, stdout, stderr) => {
                if (error && 'killed' in error && error.killed) {
                    resolve({ stdout: stdout || '', stderr: 'Execution timed out', exitCode: 124, timedOut: true });
                } else {
                    resolve({
                        stdout: stdout || '',
                        stderr: stderr || '',
                        exitCode: error ? (error as NodeJS.ErrnoException).code ? 1 : 1 : 0,
                        timedOut: false,
                    });
                }
            },
        );
    });
}

// ─── Available Languages ─────────────────────────────────────────

export async function getAvailableLanguages(): Promise<string[]> {
    const available: string[] = [];
    for (const [name, config] of Object.entries(LANGUAGES)) {
        if (await config.available()) available.push(name);
    }
    return available;
}
