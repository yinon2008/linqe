/**
 * Streaming parser that extracts the content of <file path="index.html">...</file> blocks
 * from a Claude response as tokens arrive.
 */
export class FileTagParser {
  private buffer = "";
  private insideFile = false;
  private fileContent = "";

  /** Feed the next token chunk. Returns accumulated content + whether the tag is closed. */
  feed(chunk: string): { content: string; isComplete: boolean } {
    this.buffer += chunk;

    if (!this.insideFile) {
      const tag = '<file path="index.html">';
      const start = this.buffer.indexOf(tag);
      if (start !== -1) {
        this.insideFile = true;
        this.buffer = this.buffer.slice(start + tag.length);
      }
    }

    if (this.insideFile) {
      const end = this.buffer.indexOf("</file>");
      if (end !== -1) {
        this.fileContent += this.buffer.slice(0, end);
        this.buffer = "";
        return { content: this.fileContent, isComplete: true };
      }
      this.fileContent += this.buffer;
      this.buffer = "";
      return { content: this.fileContent, isComplete: false };
    }

    return { content: "", isComplete: false };
  }

  /** The accumulated file content seen so far (partial or complete). */
  get accumulated(): string {
    return this.fileContent;
  }

  reset() {
    this.buffer = "";
    this.insideFile = false;
    this.fileContent = "";
  }
}
