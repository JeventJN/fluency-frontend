import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupBrand } from '../../../../models/signup-brand';
import { LocationService } from '../../../../services/location.service';
import { GenderService } from '../../../../services/gender.service';
import { AgeService } from '../../../../services/age.service';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from "../choose-category/category-card/category-card.component";
import { UserService } from '../../../../services/user.service';
import { ConfirmationPopupComponent } from "../../../../components/confirmation-popup/confirmation-popup.component";
import { AlertErrorComponent } from "../../../../components/alert-error/alert-error.component";

@Component({
  selector: 'app-brand-target-market',
  standalone: true,
  imports: [FormsModule, CommonModule, CategoryCardComponent, ReactiveFormsModule, ConfirmationPopupComponent, AlertErrorComponent],
  templateUrl: './brand-target-market.component.html',
  styleUrl: './brand-target-market.component.css'
})
export class BrandTargetMarketComponent implements OnInit {

  newUser: SignupBrand;
  targetForm!: FormGroup;
  submitted = false;

  targetLocation: [] = [];
  targetAge: [] = [];
  targetGender: [] = [];

  constructor(
    private router: Router,
    private locationService: LocationService,
    private genderService: GenderService,
    private ageService: AgeService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.newUser = navigation?.extras.state?.['newUser'];
  }

  locationOptions!: any[];
  ageOptions!: any[];
  genderOptions!: any[];

  ngOnInit(): void {
    this.locationService.getAllLocations().subscribe(
      (data) => {
        this.locationOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.ageService.getAllAgeRange().subscribe(
      (data) => {
        this.ageOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.genderService.getAllGender().subscribe(
      (data) => {
        this.genderOptions = data;
      },
      (error) => {
        console.log(error);
      }
    )

    this.targetForm = this.fb.group({
          targetLocation: ['', Validators.required],
          targetAge: ['', [Validators.required]],
    });

    this.targetForm.setValue({
      targetLocation: this.newUser.targetLocation,
      targetAge: this.newUser.targetAgeRange
    });

    this.selectedGender = this.newUser.targetGender
  }

  selectedGender: any[] = [];

  isSelected(categoryId: number) {

    // influencer
    if (this.selectedGender.length > 2) {
      return false;
    }

    if (this.selectedGender.includes(categoryId)) {
      return true;
    } else {
      return false;
    }
  }

  selectGender(categoryId: number) {
    // toggle
    if (this.selectedGender.includes(categoryId)) {
      this.selectedGender.splice(this.selectedGender.indexOf(categoryId), 1);
    } else {
      this.selectedGender?.push(categoryId);
    }
  }

  signUpError: boolean = false;

  onSubmit() {
    this.displayConfirmation = false;

    this.newUser.targetLocation = (this.targetForm.get('targetLocation')?.value);
    this.newUser.targetAgeRange = (this.targetForm.get('targetAge')?.value);
    this.newUser.targetGender = this.selectedGender;

    let formData = new FormData();

    formData.append('data', JSON.stringify({
      userType: this.newUser.userType,
      name: this.newUser.name,
      email: this.newUser.email,
      phone: this.newUser.phone,
      location: this.newUser.location,
      category: this.newUser.category,
      password: this.newUser.password,
      targetAgeRange: this.newUser.targetAgeRange,
      targetGender: this.newUser.targetGender,
      targetLocation: this.newUser.targetLocation,
    }));


    if (this.newUser.profilePicture) {
      formData.append('profile_picture', this.newUser.profilePicture, this.newUser.profilePictureName); // Add the file
    } else {
      formData.append('profile_picture', new Blob, ''); // Add the file
    }

    this.userService.signUpBrand(formData).subscribe(
      (data) => {
        // redirect ke login
        this.router.navigate(['/login/brand'], {state: { status: "success"}});
      },
      (error) => {
        this.signUpError = true;
      }
    )

  }

  prevStep(): void {
    this.newUser.targetAgeRange = this.targetForm.get('targetAge')?.value;
    this.newUser.targetLocation = this.targetForm.get('targetLocation')?.value;
    this.newUser.targetGender = this.selectedGender;
    console.log(this.newUser);
    if (this.newUser?.userType === 'brand') {
      this.router.navigate(['/signup/brand/category'],  { state: { newUser: this.newUser, userType: "brand" } });
    }
  }

  confirmCancel() {
    this.displayConfirmation = false;
  }

  confirmConfirm() {
    this.onSubmit();
  }

  displayConfirmation: boolean = false;
  confirmHeader: any;
  confirmBody: any;

  askConfirm(id: any) {
    console.log(id);
    this.submitted = true;
    if (this.targetForm.valid && this.selectedGender.length > 0) {
      if (id == 1) {
        this.confirmHeader = "Sign up now";
        this.confirmBody = "Are you sure want to sign up now?"
        this.displayConfirmation = true;
      }
    }
  }
  get profileFormControl() {
    return this.targetForm.controls;
  }
}
