import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/http/response.dart';

class NotFoundException implements HttpException {
  final Response response;
  @override
  final String message = 'Resource not found.';

  NotFoundException({required this.response});
}
