import 'dart:convert';

import 'package:usafes/models/base.dart';
import 'package:usafes/models/file.dart';
import 'package:usafes/models/section.dart';

class UserModel extends BaseModel {
  String schoolId;
  String firstName;
  String lastName;
  String email;
  int sectionId;
  SectionModel? section;
  FileModel? picture;

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
    this.picture,
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
        lastName: data['last_name'],
        email: data['email'],
        createdAt: data['created_at'],
        updatedAt: data['updated_at'],
        sectionId: data.containsKey('section_id') && data['section_id'] != null
            ? data['section_id']
            : 0,
        section: data.containsKey('section') && data['section'] != null
            ? SectionModel.fromJson(data['section'])
            : null,
        picture: data.containsKey('picture') && data['picture'] != null
            ? FileModel.fromJson(data['picture'])
            : null);

    return instance;
  }

  static List<UserModel> collection(List<dynamic> collection) {
    List<UserModel> data = [];

    for (var entry in collection) {
      data.add(UserModel.fromJson(entry));
    }

    return data;
  }

  @override
  toObject() {
    return {
      'id': id,
      'school_id': schoolId,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'section_id': sectionId,
      'created_at': createdAt,
      'updated_at': updatedAt,
      'section': section?.toObject(),
      'picture': picture?.toObject(),
    };
  }

  @override
  String toJson() {
    return jsonEncode(toObject());
  }
}
