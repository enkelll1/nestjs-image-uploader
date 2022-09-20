export class Utils {
  static async checkImageFormat(image) {
    const imageExtention = image.mimetype.substring(
      image.mimetype.lastIndexOf('/') + 1,
    );
    if (
      imageExtention === 'png' ||
      imageExtention === 'jpg' ||
      imageExtention === 'jpeg' ||
      imageExtention === 'PNG' ||
      imageExtention === 'JPG' ||
      imageExtention === 'JPEG'
    ) {
      return true;
    } else {
      return false;
    }
  }
}
