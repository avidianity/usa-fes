import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/http/response.dart';

class ForbiddenException implements HttpException {
  final Response response;
  @override
  final String message;

  ForbiddenException(
      {this.message = 'This action is forbidden.', required this.response});
}
