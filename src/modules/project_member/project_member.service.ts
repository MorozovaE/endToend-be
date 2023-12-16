import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from './entities/project_member.entity';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async setCreator(userId: number, projectId: number, roleId: number) {
    const project = this.projectMemberRepository.insert({
      user: { id: userId },
      project: { id: projectId },
      role: { id: roleId },
    });

    return project;
  }

  async createRequest({
    userId,
    uuid
  }: {
    userId: number;
    uuid: string
  }) {
    const project = await this.projectRepository.findOne({
      where: {
        uuid: uuid
      }
    })

    console.log("76b13aa4-3f93-4e6a-878a-400ddb35a3b1");
    

    const request = this.projectMemberRepository.insert({
      user: { id: userId },
      role: { id: 3 },
      project: { id: project.id},
    });
    return request;
  }

  async deleteRequest(projectId: number, userId: number) {
    await this.projectMemberRepository.delete({
      project: { id: projectId },
      user: { id: userId },
    });
  }

  async setGuest(userId: number, projectId: number) {
    await this.projectMemberRepository.update(
      {
        user: { id: userId },
        project: { id: projectId },
      },
      { role: { id: 2 } },
    );
  }

  async getOutgoingRequests(userId: number) {
    return await this.projectMemberRepository.find({
      where: {
        role: {
          id: 3,
        },
        user: {
          id: userId,
        },
      },
      relations: {
        project: true,
      },
    });
  }

  async getIncomingRequests(userId: number) {
    const projectMembers = await this.projectMemberRepository.find({
      where: {
        role: { id: 1 },
        user: { id: userId },
      },
      relations: {
        project: true,
      },
    });

    const projectIds = [projectMembers.map((pm) => pm.project.id)];

    const projects = await this.projectMemberRepository.find({
      where: {
        role: { id: 3 },
        project: {
          id: In(projectIds),
        },
      },
      relations: {
        user: true,
        project: true,
      },
    });

    return projects;
  }
}
