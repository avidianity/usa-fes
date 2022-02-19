import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/http/response.dart';

class ValidationException implements HttpException {
  final Map<String, dynamic> errors;
  @override
  final String message;
  final Response response;

  ValidationException(
      {this.message = 'The given data is invalid.',
      required this.errors,
      required this.response});

  Map<String, dynamic> getErrors() {
    return errors;
  }
}
