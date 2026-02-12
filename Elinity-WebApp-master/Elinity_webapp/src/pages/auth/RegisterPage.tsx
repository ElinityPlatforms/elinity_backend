import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MdEmail, MdLock, MdPerson, MdPhone, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useAuth } from '../../auth/AuthContext';
import './Auth.css';

interface RegisterForm {
    full_name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
    const password = watch('password');

    const onSubmit = async (data: RegisterForm) => {
        try {
            setIsLoading(true);
            setError('');

            const { confirmPassword, full_name, ...registerData } = data;
            await registerUser(registerData);

            // Navigate to onboarding or dashboard
            navigate('/');
        } catch (err: any) {
            setError(err.message || err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-header">
                    <img src="/mainlogo.png" alt="Elinity" className="auth-logo" />
                    <h1>Create Account</h1>
                    <p>Start your journey to meaningful connections</p>
                </div>

                <Card className="auth-card">
                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            leftIcon={<MdPerson />}
                            error={errors.full_name?.message}
                            fullWidth
                            {...register('full_name', {
                                required: 'Full name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters',
                                },
                            })}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            leftIcon={<MdEmail />}
                            error={errors.email?.message}
                            fullWidth
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />

                        <Input
                            label="Phone (Optional)"
                            type="tel"
                            placeholder="Enter your phone number"
                            leftIcon={<MdPhone />}
                            error={errors.phone?.message}
                            fullWidth
                            {...register('phone')}
                        />

                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            leftIcon={<MdLock />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                                >
                                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                </button>
                            }
                            error={errors.password?.message}
                            fullWidth
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: 'Password must contain uppercase, lowercase, and number',
                                },
                            })}
                        />

                        <Input
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            leftIcon={<MdLock />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                                >
                                    {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                </button>
                            }
                            error={errors.confirmPassword?.message}
                            fullWidth
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) => value === password || 'Passwords do not match',
                            })}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                        >
                            Create Account
                        </Button>

                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            fullWidth
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Sign In
                        </Button>
                    </form>
                </Card>

                <p className="auth-footer">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
