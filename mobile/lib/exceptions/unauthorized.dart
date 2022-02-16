import 'package:usafes/http/response.dart';

class UnauthorizedException implements Exception {
  final Response response;
  UnauthorizedException({required this.response});
}
