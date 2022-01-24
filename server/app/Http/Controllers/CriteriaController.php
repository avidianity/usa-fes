<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCriteriaRequest;
use App\Http\Requests\UpdateCriteraOrderRequest;
use App\Http\Requests\UpdateCriteriaRequest;
use App\Models\Answer;
use App\Models\Criteria;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\Request;

class CriteriaController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN))->except('index', 'show', 'forFaculty');
        $this->middleware(sprintf('role:%s,%s', User::ADMIN, User::FACULTY))->only('forFaculty');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Criteria::orderBy('order')
            ->with('questions')
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreCriteriaRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCriteriaRequest $request)
    {
        return Criteria::create($request->validated());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Criteria  $criteria
     * @return \Illuminate\Http\Response
     */
    public function show(Criteria $criteria)
    {
        return $criteria;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateCriteriaRequest  $request
     * @param  \App\Models\Criteria  $criteria
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCriteriaRequest $request, Criteria $criteria)
    {
        $criteria->update($request->validated());

        return $criteria;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Criteria  $criteria
     * @return \Illuminate\Http\Response
     */
    public function destroy(Criteria $criteria)
    {
        $criteria->delete();

        return response('', 204);
    }

    public function reorder(UpdateCriteraOrderRequest $request)
    {
        $data = collect($request->validated()['criterias']);

        return $data->map(function ($item) {
            $criteria = Criteria::findOrFail($item['id']);
            $criteria->update(['order' => $item['order']]);
            return $criteria;
        });
    }

    public function forFaculty(Request $request, int $id)
    {
        /**
         * @var \App\Models\User
         */
        $user = $request->user();

        $faculty = null;

        if ($user->role === User::FACULTY) {
            if ($user->id !== $id) {
                return response(['message' => 'You are not allowed to access this resource.'], 403);
            } else {
                $faculty = $user;
            }
        }

        if (!$faculty) {
            $faculty = User::role(User::FACULTY)->find($id);
        }

        if (!$faculty) {
            return response(['message' => 'Faculty does not exist.'], 404);
        }

        $criterias = Criteria::orderBy('order')
            ->with('questions')
            ->get();

        return $criterias->map(function (Criteria $criteria) use ($faculty) {
            $criteria->questions = $criteria->questions->map(function (Question $question) use ($faculty) {
                /**
                 * @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\Answer>
                 */
                $answers = $question->answers()->where('faculty_id', $faculty->id)->get();
                $question->answer_meta = [
                    'five' => $answers->filter(fn (Answer $answer) => $answer->rating === 5)->count(),
                    'four' => $answers->filter(fn (Answer $answer) => $answer->rating === 4)->count(),
                    'three' => $answers->filter(fn (Answer $answer) => $answer->rating === 3)->count(),
                    'two' => $answers->filter(fn (Answer $answer) => $answer->rating === 2)->count(),
                    'one' => $answers->filter(fn (Answer $answer) => $answer->rating === 1)->count(),
                ];

                return $question;
            });

            return $criteria;
        });
    }
}
