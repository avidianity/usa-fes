<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionOrderRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Criteria;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class QuestionController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN))->except('index', 'show');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\Criteria  $criteria
     * @return \Illuminate\Http\Response
     */
    public function index(Criteria $criteria)
    {
        return $criteria->questions()->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreQuestionRequest  $request
     * @param \ App\Models\Criteria  $criteria
     * @return \Illuminate\Http\Response
     */
    public function store(StoreQuestionRequest $request, Criteria $criteria)
    {
        return $criteria->questions()->create($request->validated());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Criteria  $criteria
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function show(Criteria $criteria, Question $question)
    {
        if ($criteria->id !== $question->criteria_id) {
            throw newModelNotFound($question);
        }

        return $question;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateQuestionRequest  $request
     * @param  \App\Models\Question  $criteria
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateQuestionRequest $request, Criteria $criteria, Question $question)
    {
        if ($criteria->id !== $question->criteria_id) {
            throw newModelNotFound($question);
        }

        $question->update($request->validated());

        return $question;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Question  $criteria
     * @return \Illuminate\Http\Response
     */
    public function destroy(Criteria $criteria, Question $question)
    {
        if ($criteria->id !== $question->criteria_id) {
            throw newModelNotFound($question);
        }

        $question->delete();

        return response('', 204);
    }

    public function reorder(UpdateQuestionOrderRequest $request)
    {
        $data = collect($request->validated()['criterias']);

        return $data->map(function ($item) {
            $criteria_id = $item['id'];
            $questions = collect($item['questions']);

            return $questions->map(function ($item) use ($criteria_id) {
                $question = Question::where('criteria_id', $criteria_id)->findOrFail($item['id']);
                $question->update(['order' => $item['order']]);
                return $question;
            });
        });
    }
}
