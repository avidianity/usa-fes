import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/http/response.dart';

class InternalServerErrorException implements HttpException {
  final Response response;
  @override
  final String message;

  InternalServerErrorException({
    this.message = 'Something went wrong. Please try again later.',
    required this.response,
  });
}
