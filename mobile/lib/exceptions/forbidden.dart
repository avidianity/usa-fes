import 'package:usafes/http/response.dart';

class ForbiddenException implements Exception {
  final Response response;
  final String message;

  ForbiddenException(
      {this.message = 'This action is forbidden.', required this.response});
}
