import 'package:usafes/http/response.dart';

class NotFoundException implements Exception {
  final Response response;

  NotFoundException({required this.response});
}
