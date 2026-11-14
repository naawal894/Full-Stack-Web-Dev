import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  city?: string;
  province?: string;
  createdAt: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: "Nawal Fateh",
      email: "nawal@example.com",
      phone: "+92 300 1234567",
      password: "Password123!",
      address: "Sector E-9, Air University",
      city: "Islamabad",
      province: "Federal Capital",
      createdAt: "2026-10-25T10:00:00.000Z"
    }
  ];

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }

  findOne(id: number): Omit<User, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }

  signup(data: { name: string; email: string; phone?: string; password: string; city?: string; province?: string; address?: string }) {
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    const existing = this.users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase().trim()
    );
    if (existing) {
      throw new ConflictException(`User with email "${data.email}" already exists`);
    }

    const nextId = this.users.length > 0
      ? Math.max(...this.users.map((u) => u.id)) + 1
      : 1;

    const newUser: User = {
      id: nextId,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone || '',
      password: data.password,
      address: data.address || '',
      city: data.city || 'Islamabad',
      province: data.province || 'Federal Capital',
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);

    const { password, ...safeUser } = newUser;
    return {
      success: true,
      message: 'Customer registered successfully',
      user: safeUser
    };
  }

  login(data: { email: string; password: string }) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = this.users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase().trim()
    );

    if (!user || user.password !== data.password) {
      throw new BadRequestException('Invalid email or password');
    }

    const { password, ...safeUser } = user;
    return {
      success: true,
      message: 'Login successful',
      user: safeUser
    };
  }

  update(id: number, data: Partial<User>): Omit<User, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.address !== undefined) user.address = data.address;
    if (data.city !== undefined) user.city = data.city;
    if (data.province !== undefined) user.province = data.province;
    if (data.password !== undefined) user.password = data.password;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  remove(id: number): { success: boolean; message: string } {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
    return { success: true, message: `User ${id} removed successfully` };
  }
}
