import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.interface';

type NewPatientForm = Omit<Patient, 'id'> & {
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-patient-container">
      <div class="page-header">
        <h1 class="page-title">Add New Patient</h1>
        <p class="page-description">Create a new patient record in the Epic FHIR system</p>
      </div>

      <div class="form-container card">
        <form (ngSubmit)="onSubmit()" #patientForm="ngForm">
          <div class="form-section">
            <h2 class="section-title">Personal Information</h2>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  class="form-input"
                  [(ngModel)]="newPatient.firstName"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  class="form-input"
                  [(ngModel)]="newPatient.lastName"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  class="form-input"
                  [(ngModel)]="newPatient.dateOfBirth"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  class="form-input"
                  [(ngModel)]="newPatient.gender"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-title">Contact Information</h2>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  class="form-input"
                  [(ngModel)]="newPatient.phone"
                  placeholder="(555) 123-4567"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="form-input"
                  [(ngModel)]="newPatient.email"
                  placeholder="patient@example.com"
                >
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-title">Address</h2>
            <div class="form-grid">
              <div class="form-group form-group-full">
                <label class="form-label" for="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  class="form-input"
                  [(ngModel)]="newPatient.address.street"
                  placeholder="123 Main Street"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  class="form-input"
                  [(ngModel)]="newPatient.address.city"
                  placeholder="Springfield"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  class="form-input"
                  [(ngModel)]="newPatient.address.state"
                  placeholder="IL"
                  maxlength="2"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="zip">ZIP Code</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  class="form-input"
                  [(ngModel)]="newPatient.address.zip"
                  placeholder="62701"
                >
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-title">Medical Information</h2>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="mrn">Medical Record Number (MRN) *</label>
                <input
                  type="text"
                  id="mrn"
                  name="mrn"
                  class="form-input"
                  [(ngModel)]="newPatient.mrn"
                  placeholder="MRN123456"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="insuranceId">Insurance ID</label>
                <input
                  type="text"
                  id="insuranceId"
                  name="insuranceId"
                  class="form-input"
                  [(ngModel)]="newPatient.insuranceId"
                  placeholder="INS-001"
                >
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="resetForm()">
              Reset Form
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="!patientForm.valid || isSubmitting"
            >
              <span *ngIf="isSubmitting">Adding Patient...</span>
              <span *ngIf="!isSubmitting">Add Patient</span>
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="successMessage" class="success-message">
        <div class="success-content">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <h3>Patient Added Successfully</h3>
            <p>{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-patient-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--neutral-800);
      margin-bottom: 0.5rem;
    }

    .page-description {
      color: var(--neutral-600);
      font-size: 1.1rem;
    }

    .form-container {
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--neutral-800);
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--primary-blue);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group-full {
      grid-column: 1 / -1;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 2rem;
      border-top: 1px solid var(--neutral-200);
    }

    .success-message {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: var(--success);
      color: white;
      padding: 1rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    .success-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .success-content h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .success-content p {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .add-patient-container {
        padding: 1rem;
      }

      .form-container {
        padding: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .success-message {
        position: relative;
        top: auto;
        right: auto;
        margin: 1rem 0;
      }
    }
  `]
})
export class AddPatientComponent {
  newPatient: NewPatientForm = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    mrn: '',
    insuranceId: ''
  };

  isSubmitting = false;
  successMessage = '';

  constructor(private patientService: PatientService) {}

  onSubmit() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    
    this.patientService.addPatient(this.newPatient).subscribe(
      patient => {
        this.successMessage = `${patient.firstName} ${patient.lastName} has been added to the system.`;
        this.resetForm();
        this.isSubmitting = false;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error => {
        console.error('Error adding patient:', error);
        this.isSubmitting = false;
      }
    );
  }

  resetForm() {
    this.newPatient = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      mrn: '',
      insuranceId: ''
    };
  }
}