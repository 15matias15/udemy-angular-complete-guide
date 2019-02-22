import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { RecipeService } from '../../recipes/recipe.service';
import { Recipe } from '../../recipes/recipe.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class DataStorageService {
    private url = 'https://ng-shopping-app-99e23.firebaseio.com/';
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

    storeRecipes() {
        // const header = new HttpHeaders().set('Authorization', 'Bearer ajasdijas').append('', '');

        // return this.http.put(this.url + 'recipes.json', this.recipeService.getRecipes(), {
        //     observe: 'body',
        //     params: new HttpParams().set('auth', token)
        //     // headers: header
        // });
        const req = new HttpRequest('PUT', this.url + 'recipes.json', this.recipeService.getRecipes(), {
            reportProgress: true
        });
        return this.http.request(req);
    }

    getRecipes() {
        // this.http.get<Recipe[]>(this.url + 'recipes.json?auth=' + token)
        this.http.get<Recipe[]>(this.url + 'recipes.json', {
            observe: 'body',
            responseType: 'json'
        })
            .pipe(
                map((recipes) => {
                    for (const recipe of recipes) {
                        if (!recipe['ingredients']) {
                            recipe['ingredients'] = [];
                        }
                    }
                    return recipes;
                })
            )
            .subscribe(
                (recipes: Recipe[]) => {
                    this.recipeService.setRecipes(recipes);
                }
            );
    }
}
