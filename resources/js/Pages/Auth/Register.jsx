'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Component() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    setIsPasswordValid(data.password.length >= 8);
  }, [data.password]);

  const setFormData = (key, value) => {
    setData(prevData => ({ ...prevData, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulating form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessing(false);
    // Reset password fields after submission
    setData(prevData => ({ ...prevData, password: '', password_confirmation: '' }));
  };

  return (
    <div className="flex items-center justify-center bg-black border border-1 rounded-lg border-secondary p-5">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white pb-6">Create an account!</h1>
        <form onSubmit={submit} className="space-y-4">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={data.name}
              onChange={(e) => setFormData('name', e.target.value)}
              required
            />
            <ErrorWithAnimation message={errors.name} />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setFormData('email', e.target.value)}
              required
            />
            <ErrorWithAnimation message={errors.email} />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setFormData('password', e.target.value)}
              required
            />
            <ErrorWithAnimation message={errors.password} />
            {data.password && !isPasswordValid && (
              <p className="text-sm text-red-500">Password must be at least 8 characters long</p>
            )}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) => setFormData('password_confirmation', e.target.value)}
              required
            />
            <ErrorWithAnimation message={errors.password_confirmation} />
          </LabelInputContainer>

          <div className="mt-4 flex items-center justify-end">
            <Link
              href="/login"
              className="text-sm text-white underline hover:text-slate-200"
            >
              Already registered?
            </Link>

            <Button
              type="submit"
              disabled={processing || !isPasswordValid}
              className="ml-4"
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ErrorWithAnimation = ({ message }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: message ? 1 : 0 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
      className="mt-2 text-red-600"
    >
      {message}
    </motion.div>
  );
};

const LabelInputContainer = ({ children }) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {children}
    </div>
  );
};