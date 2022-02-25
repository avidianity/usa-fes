import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:usafes/exceptions/no_token.dart';
import 'package:usafes/http/client.dart';
import 'package:usafes/models/academic_year.dart';
import 'package:usafes/services/responses/analytics.dart';

class AnalyticsService {
  final http = Client();
  final storage = const FlutterSecureStorage();

  Future<AnalyticsResponse> fetch() async {
    final token = await storage.read(key: 'token');

    if (token == null) {
      throw NoTokenException();
    }

    final response = await http.get('/api/analytics', headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer $token'
    });

    return AnalyticsResponse(
      academicYear: AcademicYearModel.fromJson(
        response.data['academic_year'],
      ),
    );
  }
}
