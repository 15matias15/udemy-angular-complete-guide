import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Ingredient } from '../../shared/models/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducers';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  addIngredientForm: FormGroup;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.addIngredientForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.min(1)])
    });

    this.subscription = this.store.select('shoppingList').subscribe(data => {
      if (data.editedIngredientIndex > -1) {
        this.editedItem = data.editedIngredient;
        this.editMode = true;
        this.addIngredientForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editedItem = null;
        this.editMode = false;
      }
    });
  }

  onSubmit() {
    const nameIng = this.addIngredientForm.get('name').value;
    const amountIng = this.addIngredientForm.get('amount').value;
    const newIng = new Ingredient(nameIng, amountIng);

    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIng));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIng));
    }
    this.onClear();
  }

  onClear() {
    this.addIngredientForm.reset();
    this.editMode = false;
  }

  onDeleteIngredient() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
