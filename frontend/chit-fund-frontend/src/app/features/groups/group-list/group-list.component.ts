import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Group {
  groupId: string;
  groupName: string;
  groupType: string;
  totalAmount: number;
  members: number;
  duration: number;
  description: string;
  startDate: Date;
  endDate: Date;
  organizerId: string;
}

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupsListComponent implements OnInit {
  groups: Group[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups(): void {
    this.http.get<Group[]>('http://localhost:8083/api/groups')
      .subscribe({
        next: (data) => {
          this.groups = data.map(group => ({
            ...group,
            startDate: new Date(group.startDate),
            endDate: new Date(group.endDate)
          }));
        },
        error: (error) => console.error('Error fetching groups:', error)
      });
  }

  navigateToDetails(groupId: string): void {
    this.router.navigate(['/groups', groupId]);
  }
}