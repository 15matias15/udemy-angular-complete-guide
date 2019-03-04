import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as RecipeActions from '../store/recipe.actions';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import * as fromRecipe from '../store/recipe.reducers';

@Injectable()
export class RecipeEffects {
  @Effect()
  recipeFetch = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap((action: RecipeActions.FetchRecipes) => {
      return this.http.get<Recipe[]>(this.url + 'recipes.json', {
        observe: 'body',
        responseType: 'json'
      });
    }),
    map(recipes => {
      for (const recipe of recipes) {
        if (!recipe['ingredients']) {
          recipe['ingredients'] = [];
        }
      }
      return {
        type: RecipeActions.SET_RECIPES,
        payload: recipes
      };
    })
  );

  @Effect({ dispatch: false })
  recipeStore = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([action, state]) => {
      const req = new HttpRequest(
        'PUT',
        this.url + 'recipes.json',
        state.recipes,
        {
          reportProgress: true
        }
      );
      return this.http.request(req);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromRecipe.FeatureState>
  ) {}
  private url = 'https://ng-shopping-app-99e23.firebaseio.com/';
}
