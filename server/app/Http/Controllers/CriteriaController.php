<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCriteriaRequest;
use App\Http\Requests\UpdateCriteraOrderRequest;
use App\Http\Requests\UpdateCriteriaRequest;
use App\Models\Criteria;
use App\Models\User;

class CriteriaController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN))->except('index', 'show');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Criteria::all();
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

        $criterias = Criteria::findMany($data->map->id);

        return $data->map->order->map(function ($order, $index) use ($criterias) {
            $criteria = $criterias[$index];

            $criteria->update(['order' => $order]);

            return $criteria;
        });
    }
}
