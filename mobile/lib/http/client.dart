import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:usafes/exceptions/http/forbidden.dart';
import 'package:usafes/exceptions/http/internal_server_error.dart';
import 'package:usafes/exceptions/http/not_found.dart';
import 'package:usafes/exceptions/http/unauthorized.dart';
import 'package:usafes/exceptions/http/validation.dart';
import 'package:usafes/http/response.dart';

class Client {
  final String _baseUrl = dotenv.env['SERVER_URL']!;

  Uri _createUri(String path, Map<String, dynamic>? params) {
    final parsed = Uri.parse(_baseUrl + path);

    return Uri(
      scheme: parsed.scheme,
      host: parsed.host,
      port: parsed.port,
      path: parsed.path,
      queryParameters: params,
    );
  }

  _handleResponse(http.Response base) {
    final response = Response(
      code: base.statusCode,
      data: jsonDecode(base.body),
      headers: base.headers,
    );

    switch (response.code) {
      case 500:
        throw InternalServerErrorException(
          response: response,
          message: response.data['message'],
        );
      case 422:
        throw ValidationException(
          errors: response.data['errors'],
          response: response,
        );
      case 404:
        throw NotFoundException(response: response);
      case 403:
        throw ForbiddenException(
          response: response,
          message: response.data['message'],
        );
      case 401:
        throw UnauthorizedException(response: response);
    }

    return response;
  }

  Future<Response<T>> get<T>(String path,
      {Map<String, String>? headers, Map<String, dynamic>? params}) async {
    final uri = _createUri(path, params);

    final response = await http.get(uri, headers: headers);

    return _handleResponse(response);
  }

  Future<Response<T>> post<T>(String path, Object? data,
      {Map<String, String>? headers, Map<String, dynamic>? params}) async {
    final uri = _createUri(path, params);

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode(data),
    );

    return _handleResponse(response);
  }

  Future<Response<T>> put<T>(String path, Object? data,
      {Map<String, String>? headers, Map<String, dynamic>? params}) async {
    final uri = _createUri(path, params);

    final response = await http.put(
      uri,
      headers: headers,
      body: jsonEncode(data),
    );

    return _handleResponse(response);
  }

  Future<Response<T>> patch<T>(String path, Object? data,
      {Map<String, String>? headers, Map<String, dynamic>? params}) async {
    final uri = _createUri(path, params);

    final response = await http.patch(
      uri,
      headers: headers,
      body: jsonEncode(data),
    );

    return _handleResponse(response);
  }

  Future<Response<T>> delete<T>(String path,
      {Map<String, String>? headers, Map<String, dynamic>? params}) async {
    final uri = _createUri(path, params);

    final response = await http.delete(uri, headers: headers);

    return _handleResponse(response);
  }
}
