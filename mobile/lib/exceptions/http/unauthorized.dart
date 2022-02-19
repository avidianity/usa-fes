import 'package:usafes/exceptions/http/http.dart';
import 'package:usafes/http/response.dart';

class UnauthorizedException implements HttpException {
  final Response response;
  @override
  final String message = 'Unauthorized.';

  UnauthorizedException({required this.response});
}
