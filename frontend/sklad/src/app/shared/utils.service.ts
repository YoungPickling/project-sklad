export default class Utils {
  // Converts a hex color code to an integer.
  // Example: #ffffff > 16777215
  static hexToInteger(hex: string): number {
    // Remove the leading '#' if it exists
    if (hex.startsWith('#')) {
      hex = hex.slice(1);
    }

    // Parse the hex string as an integer with base 16
    return parseInt(hex, 16);
  }

  // Converts an integer to a hex color code.
  // Example: 16777215 > #ffffff
  static integerToHex(int: number): string {
    // Convert the integer to a hex string
    let hex = int.toString(16);

    // Ensure the hex string is 6 characters long by padding with leading zeros if necessary
    while (hex.length < 6) {
      hex = '0' + hex;
    }

    // Add the leading '#' to form a valid hex color code
    return '#' + hex;
  }

  // Converts a hex color to an RGB object
  static hexToRgb(hex: string) {
    // Remove the hash symbol if it exists
    hex = hex.replace(/^#/, '');

    // Parse the hex color to RGB
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return { r, g, b };
  }

  // Calculates the relative luminance of an RGB color
  static luminance(r: number, g: number, b: number) {
    let a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  // Determines if the font color should be white or black based on the background color
  static getFontColor(hex: string): 'white' | 'black' {
    const { r, g, b } = this.hexToRgb(hex);
    const luminance = this.luminance(r, g, b);

    // Using a threshold of 0.179 for luminance to decide font color
    return luminance > 0.179 ? 'black' : 'white';
  }

  
  static colorByOrder(i: number): string {
    return i % 6 === 0 ? 'crimson' : 
    i % 6 === 1 ? 'gold' : 
    i % 6 === 2 ? 'limegreen' :  
    i % 6 === 3 ? 'lightskyblue' : 
    i % 6 === 4 ? 'royalblue' : 'darkviolet'
  }

}