<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreManyAnswersRequest;
use App\Models\AcademicYear;
use App\Models\Answer;
use App\Models\Evaluation;
use App\Models\Faculty;
use App\Models\Question;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AnswerController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN))->only('destroy');
        $this->middleware([sprintf('role:%s', User::STUDENT), 'academic-year'])->only('storeMany');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function index(Question $question)
    {
        return $question->answers;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Question  $question
     * @param  \App\Models\Answer  $answer
     * @return \Illuminate\Http\Response
     */
    public function show(Question $question, Answer $answer)
    {
        if ($question->id !== $answer->question_id) {
            throw newModelNotFound($answer);
        }

        return $answer;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Question  $question
     * @param  \App\Models\Answer  $answer
     * @return \Illuminate\Http\Response
     */
    public function destroy(Question $question, Answer $answer)
    {
        if ($question->id !== $answer->question_id) {
            throw newModelNotFound($answer);
        }

        $answer->delete();

        return response('', 204);
    }

    public function storeMany(StoreManyAnswersRequest $request)
    {
        return DB::transaction(function () use ($request) {
            list('faculty_id' => $facultyId, 'answers' => $answers) = $request->validated();

            $comments = $request->input('comments');

            /**
             * @var \App\Models\User
             */
            $user = $request->user();

            $faculty = Faculty::findOrFail($facultyId);

            $answers = $faculty->answers()->createMany(
                collect($answers)->map(function ($data) use ($user) {
                    $data['student_id'] = $user->id;
                    return $data;
                })
            );

            $evaluation = Evaluation::create([
                'academic_year_id' => AcademicYear::active()->status(AcademicYear::EVALUATION_ONGOING)->firstOrFail()->id,
                'student_id' => $user->id,
                'faculty_id' => $faculty->id,
                'comments' => $comments
            ]);

            return [
                'evaluation' => $evaluation,
                'answers' => $answers,
            ];
        });
    }
}
