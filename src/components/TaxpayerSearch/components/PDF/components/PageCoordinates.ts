class PageCoordinates {
  private readonly width: number;
  private readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  get(xPercentage: number, yPercentage: number) {
    if (xPercentage < 0 || xPercentage > 1 || yPercentage < 0 || yPercentage > 1) {
      throw new Error('Los porcentajes deben estar entre 0 y 1.');
    }

    const x = this.width * xPercentage;
    const y = this.height * yPercentage;

    return { x, y };
  }
}
export default PageCoordinates;