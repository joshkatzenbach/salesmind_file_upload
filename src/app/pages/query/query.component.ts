import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryService, QueryRequest, QueryResponse } from '../../services/query.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  queryForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  response: QueryResponse | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private queryService: QueryService
  ) {
    this.queryForm = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    // Clear any previous responses when component loads
    this.response = null;
    this.error = null;
  }

  onSubmit(): void {
    if (this.queryForm.valid) {
      this.isLoading = true;
      this.error = null;
      // Don't clear the response here - only clear it on successful submission
      // this.response = null;

      const queryRequest: QueryRequest = {
        question: this.queryForm.value.question
      };

      this.queryService.submitQuery(queryRequest).then(response => {
        this.response = response;
        this.isLoading = false;
        // Only clear the form on successful submission
        this.queryForm.reset();
      }).catch(error => {
        this.error = 'Failed to submit query. Please try again.';
        this.isLoading = false;
        // Keep the form input filled in on error
        console.error('Query error:', error);
      });
    }
  }

  getWordCount(text: string): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  }
}