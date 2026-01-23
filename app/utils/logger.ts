import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Saves the response text to a JSON log file
 * @param dataText - The response text to save
 */
export async function saveResponseLog(dataText: string): Promise<void> {
  try {
    const timestamp = Date.now();
    const filename = `ollama-response-${timestamp}.json`;
    const logsDir = join(process.cwd(), 'logs');
    const filepath = join(logsDir, filename);
    
    // Create logs directory if it doesn't exist
    await mkdir(logsDir, { recursive: true });
    
    // Save the response text to JSON file
    await writeFile(filepath, dataText, { encoding: 'utf-8' });
    console.log(`Response saved to: ${filepath}`);
  } catch (saveError) {
    // Don't fail the request if file saving fails, just log it
    console.error('Failed to save response to file:', saveError);
  }
}
