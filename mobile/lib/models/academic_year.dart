import 'dart:convert';

import 'package:usafes/models/base.dart';

class AcademicYearModel extends BaseModel {
  String year;
  String semester;
  bool active;
  String status;

  AcademicYearModel({
    required int id,
    required this.year,
    required this.semester,
    required this.active,
    required this.status,
    required String createdAt,
    required String updatedAt,
  }) : super(
          id: id,
          createdAt: createdAt,
          updatedAt: updatedAt,
        );

  factory AcademicYearModel.fromJson(dynamic data) {
    var instance = AcademicYearModel(
      id: data['id'],
      year: data['year'],
      semester: data['semester'],
      active: data['active'],
      status: data['status'],
      createdAt: data['created_at'],
      updatedAt: data['updated_at'],
    );

    return instance;
  }

  static List<AcademicYearModel> collection(List<dynamic> collection) {
    List<AcademicYearModel> data = [];

    for (var entry in collection) {
      data.add(AcademicYearModel.fromJson(entry));
    }

    return data;
  }

  @override
  toObject() {
    return {
      'id': id,
      'year': year,
      'semester': semester,
      'active': active,
      'status': status,
      'created_at': createdAt,
      'updated_at': updatedAt
    };
  }

  @override
  String toJson() {
    return jsonEncode(toObject());
  }
}
