import 'package:usafes/http/response.dart';

class InternalServerErrorException implements Exception {
  final Response response;
  final String message;

  InternalServerErrorException({
    this.message = 'Something went wrong. Please try again later.',
    required this.response,
  });
}
