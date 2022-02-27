import 'package:flutter/material.dart';
import 'package:usafes/models/criteria.dart';
import 'package:usafes/models/question.dart';

class Criteria extends StatefulWidget {
  final CriteriaModel criteria;
  final Function(int questionId, int answer) onAnswer;
  final Map<int, int> answers;
  const Criteria({
    Key? key,
    required this.criteria,
    required this.onAnswer,
    required this.answers,
  }) : super(key: key);

  @override
  _CriteriaState createState() => _CriteriaState();
}

class _CriteriaState extends State<Criteria> {
  final answerText = {
    5: 'Strongly Agree',
    4: 'Agree',
    3: 'Uncertain',
    2: 'Disagree',
    1: 'Strongly Disagree',
  };

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.3),
            blurRadius: 30,
            spreadRadius: 0.2,
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.only(top: 12.0, bottom: 12.0),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.only(
              left: 4.0,
              right: 4.0,
              top: 8.0,
              bottom: 4.0,
            ),
            child: Column(
              children: <Widget>[
                ListTile(
                  title: Text(widget.criteria.title),
                ),
                ...?widget.criteria.questions
                    ?.asMap()
                    .map(_buildQuestion)
                    .values
                    .toList(),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }

  MapEntry _buildQuestion(int index, QuestionModel question) {
    return MapEntry(
      index,
      Padding(
        padding: const EdgeInsets.only(left: 12.0, top: 2.0, bottom: 2.0),
        child: Column(
          children: [
            Align(
              child: Text(
                '${index + 1}) ${question.description}',
                style: const TextStyle(color: Colors.grey),
              ),
              alignment: Alignment.centerLeft,
            ),
            for (var x = 5; x >= 1; x--)
              Align(
                child: ListTile(
                  title: Text(
                    answerText[x]!,
                    style: const TextStyle(color: Colors.grey, fontSize: 14),
                  ),
                  leading: Radio<int>(
                    value: x,
                    groupValue: widget.answers.containsKey(question.id)
                        ? widget.answers[question.id]
                        : null,
                    onChanged: (int? value) {
                      if (value != null) {
                        widget.onAnswer(question.id, value);
                      }
                    },
                  ),
                ),
                alignment: Alignment.centerLeft,
              ),
          ],
        ),
      ),
    );
  }
}
