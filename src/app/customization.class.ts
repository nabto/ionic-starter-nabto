export class Customization {
  // name of page to navigate to from overview (the essential page of the app)
  public static vendorPage: string = 'VendorHeatingPage';

  // supported device interface - only interact with devices that match exactly this
  public static interfaceId: string = '317aadf2-3137-474b-8ddb-fea437c424f4';

  // supported major version of the device interface - only interact with devices that match exactly this
  public static interfaceVersionMajor: number = 1;

  // supported minor version of the device interface - only interact with devices that match at least this
  public static interfaceVersionMinor: number = 0;
}
