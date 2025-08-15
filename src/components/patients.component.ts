import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.interface';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="patients-container">
      <div class="patients-header">
        <h1 class="page-title">Patient Management</h1>
        <p class="page-description">Search and view patient records from Epic FHIR resources</p>
      </div>

      <div class="search-section card">
        <div class="search-header">
          <h2>Patient Search</h2>
          <div class="search-badges">
            <span class="badge badge-success">FHIR Connected</span>
            <span class="badge badge-success">Epic Sandbox</span>
          </div>
        </div>
        
        <div class="search-form">
          <div class="search-input-group">
            <input
              type="text"
              placeholder="Search by name, MRN, or email..."
              class="form-input search-input"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
            >
            <button class="btn btn-primary search-button">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Search
            </button>
          </div>
        </div>
      </div>

      <div class="patients-grid">
        <div *ngFor="let patient of filteredPatients" class="patient-card card">
          <div class="patient-header">
            <div class="patient-avatar">
              {{ patient.firstName.charAt(0) }}{{ patient.lastName.charAt(0) }}
            </div>
            <div class="patient-basic-info">
              <h3 class="patient-name">{{ patient.firstName }} {{ patient.lastName }}</h3>
              <p class="patient-mrn">MRN: {{ patient.mrn }}</p>
            </div>
          </div>
          
          <div class="patient-details">
            <div class="detail-row">
              <span class="detail-label">Date of Birth:</span>
              <span class="detail-value">{{ formatDate(patient.dateOfBirth) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Gender:</span>
              <span class="detail-value">{{ patient.gender }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">{{ patient.phone || 'Not provided' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ patient.email || 'Not provided' }}</span>
            </div>
            <div class="detail-row" *ngIf="patient.address">
              <span class="detail-label">Address:</span>
              <span class="detail-value">
                {{ patient.address.street }}, {{ patient.address.city }}, {{ patient.address.state }} {{ patient.address.zip }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Insurance ID:</span>
              <span class="detail-value">{{ patient.insuranceId || 'Not provided' }}</span>
            </div>
          </div>
          
          <div class="patient-actions">
            <button class="btn btn-primary" (click)="viewVitals(patient.id)">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L3.5 16.99z"/>
              </svg>
              View Vitals
            </button>
            <button class="btn btn-secondary">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Patient
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredPatients.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
          </svg>
        </div>
        <h3>No patients found</h3>
        <p>Try adjusting your search criteria or add a new patient.</p>
      </div>
    </div>
  `,
  styles: [`
    .patients-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .patients-header {
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

    .search-section {
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .search-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--neutral-800);
    }

    .search-badges {
      display: flex;
      gap: 0.5rem;
    }

    .search-input-group {
      display: flex;
      gap: 1rem;
    }

    .search-input {
      flex: 1;
      font-size: 1rem;
    }

    .search-button {
      white-space: nowrap;
    }

    .patients-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .patient-card {
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .patient-card:hover {
      transform: translateY(-2px);
    }

    .patient-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--neutral-200);
    }

    .patient-avatar {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .patient-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--neutral-800);
      margin-bottom: 0.25rem;
    }

    .patient-mrn {
      color: var(--neutral-600);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .patient-details {
      margin-bottom: 1.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
      gap: 1rem;
    }

    .detail-label {
      font-weight: 500;
      color: var(--neutral-700);
      font-size: 0.875rem;
      min-width: 100px;
    }

    .detail-value {
      color: var(--neutral-600);
      font-size: 0.875rem;
      text-align: right;
      word-break: break-word;
    }

    .patient-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .patient-actions .btn {
      flex: 1;
      justify-content: center;
      min-width: 120px;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--neutral-500);
    }

    .empty-state-icon {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--neutral-700);
    }

    @media (max-width: 768px) {
      .patients-container {
        padding: 1rem;
      }

      .search-input-group {
        flex-direction: column;
      }

      .patients-grid {
        grid-template-columns: 1fr;
      }

      .patient-actions {
        flex-direction: column;
      }

      .detail-row {
        flex-direction: column;
        gap: 0.25rem;
      }

      .detail-value {
        text-align: left;
      }
    }
  `]
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchQuery: string = '';

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.patientService.patients$.subscribe(patients => {
      this.patients = patients;
      this.filteredPatients = patients;
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.patientService.searchPatients(this.searchQuery).subscribe(results => {
        this.filteredPatients = results;
      });
    } else {
      this.filteredPatients = this.patients;
    }
  }

  viewVitals(patientId: string) {
    // This would typically navigate to vitals view with patient ID
    console.log('Viewing vitals for patient:', patientId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}