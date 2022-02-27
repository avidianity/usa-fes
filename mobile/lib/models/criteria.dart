import 'dart:convert';

import 'package:usafes/models/base.dart';
import 'package:usafes/models/question.dart';

class CriteriaModel extends BaseModel {
  String title;
  int order;
  List<QuestionModel>? questions;

  CriteriaModel({
    required int id,
    required this.title,
    required this.order,
    this.questions,
    required String createdAt,
    required String updatedAt,
  }) : super(
          id: id,
          createdAt: createdAt,
          updatedAt: updatedAt,
        );

  factory CriteriaModel.fromJson(dynamic data) {
    var instance = CriteriaModel(
      id: data['id'],
      title: data['title'],
      order: data['order'],
      questions: data.containsKey('questions') && data['questions'] != null
          ? QuestionModel.collection(data['questions'])
          : null,
      createdAt: data['created_at'],
      updatedAt: data['updated_at'],
    );

    return instance;
  }

  static List<CriteriaModel> collection(List<dynamic> collection) {
    List<CriteriaModel> data = [];

    for (var entry in collection) {
      data.add(CriteriaModel.fromJson(entry));
    }

    return data;
  }

  @override
  toObject() {
    return {
      'id': id,
      'title': title,
      'order': order,
      'questions': questions?.map((question) => question.toObject()).toList(),
      'created_at': createdAt,
      'updated_at': updatedAt
    };
  }

  @override
  String toJson() {
    return jsonEncode(toObject());
  }
}
