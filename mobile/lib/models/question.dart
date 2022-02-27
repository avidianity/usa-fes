import 'dart:convert';

import 'package:usafes/models/base.dart';

class QuestionModel extends BaseModel {
  String description;
  int order;
  int criteriaId;

  QuestionModel({
    required int id,
    required this.description,
    required this.order,
    required this.criteriaId,
    required String createdAt,
    required String updatedAt,
  }) : super(
          id: id,
          createdAt: createdAt,
          updatedAt: updatedAt,
        );

  factory QuestionModel.fromJson(dynamic data) {
    var instance = QuestionModel(
      id: data['id'],
      description: data['description'],
      order: data['order'],
      criteriaId: data['criteria_id'],
      createdAt: data['created_at'],
      updatedAt: data['updated_at'],
    );

    return instance;
  }

  static List<QuestionModel> collection(List<dynamic> collection) {
    List<QuestionModel> data = [];

    for (var entry in collection) {
      data.add(QuestionModel.fromJson(entry));
    }

    return data;
  }

  @override
  toObject() {
    return {
      'id': id,
      'description': description,
      'order': order,
      'criteria_id': criteriaId,
      'created_at': createdAt,
      'updated_at': updatedAt
    };
  }

  @override
  String toJson() {
    return jsonEncode(toObject());
  }
}
