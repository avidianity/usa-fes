import 'dart:convert';

import 'package:usafes/models/base.dart';
import 'package:usafes/models/section.dart';

class UserModel extends BaseModel {
  String schoolId;
  String firstName;
  String lastName;
  String email;
  int sectionId;
  SectionModel? section;

  UserModel({
    required this.schoolId,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.sectionId,
    required int id,
    required String createdAt,
    required String updatedAt,
    this.section,
  }) : super(
          id: id,
          createdAt: createdAt,
          updatedAt: updatedAt,
        );

  factory UserModel.fromJson(dynamic data) {
    var instance = UserModel(
      id: data['id'],
      schoolId: data['school_id'],
      firstName: data['first_name'],
      lastName: data['first_name'],
      email: data['email'],
      createdAt: data['created_at'],
      updatedAt: data['updated_at'],
      sectionId: data['section_id'],
      section: data.containsKey('section')
          ? SectionModel.fromJson(data['section'])
          : null,
    );

    return instance;
  }

  @override
  String toJson() {
    return jsonEncode({
      'id': id,
      'school_id': schoolId,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'created_at': createdAt,
      'updated_at': updatedAt,
      'section': section?.toJson(),
    });
  }
}
