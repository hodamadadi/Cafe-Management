export class GlobalConstants {
  // Messages for user feedback
  public static genericError: string =
    'Something went wrong. Please try again later';
  public static unauthorized: string =
    'You are not authorized to access this page!';

  // Regular expressions for input validation
  public static nameRegex: string = '[a-zA-Z0-9 ]*';
  public static emailRegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  public static contactNumberRegex: string = '^[0-9]{10}$'; // Fixed regex pattern to only allow digits

  // Error types
  public static error: string = 'error';
}
