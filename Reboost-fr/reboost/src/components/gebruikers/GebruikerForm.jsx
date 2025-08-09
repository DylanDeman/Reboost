import React, { useState, useEffect, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ThemeContext } from '../../contexts/Theme.context';
import LabelInput from '../LabelInput';
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoShieldOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';

const validationRules = {
  naam: {
    required: 'Een gebruiker moet een naam hebben',
    minLength: { value: 2, message: 'Naam moet minstens 2 karakters lang zijn' },
  },
  wachtwoord: {
    minLength: { value: 6, message: 'Wachtwoord moet minstens 6 karakters lang zijn' },
  },
};

export default function GebruikerForm({ gebruiker, onCancel, onSave }) {
  const { theme, textTheme } = useContext(ThemeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine if the user has admin role
  const hasAdminRole = gebruiker?.roles?.includes('admin');
  
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      naam: gebruiker?.naam || '',
      wachtwoord: '',
      isAdmin: hasAdminRole || false, // Default admin status
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    reset,
    register,
  } = methods;

  useEffect(() => {
    console.log('Gebruiker received in form:', gebruiker);
    
    if (gebruiker) {
      // Determine if the user has admin role
      const hasAdminRole = gebruiker.roles?.includes('admin');
      
      console.log('Gebruiker ID in form:', gebruiker.id);
      console.log('ID type:', typeof gebruiker.id);
      
      reset({
        naam: gebruiker.naam || '',
        wachtwoord: '',
        isAdmin: hasAdminRole || false,
      });
    } else {
      console.log('Creating new user - no ID provided');
      reset({
        naam: '',
        wachtwoord: '',
        isAdmin: false, // Default to not admin for new users
      });
    }
  }, [gebruiker, reset]);

  const onSubmit = async (values) => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      const rolesArray = ['user'];
      if (values.isAdmin) {
        rolesArray.push('admin');
      }
      
 
      const userData = {
        naam: values.naam.trim(),
        wachtwoord: values.wachtwoord.trim() || undefined,
        roles: rolesArray,
      };
      

      if (gebruiker && gebruiker.id) {
        userData.id = gebruiker.id;
      }
      
      console.log('Submitting user data:', userData);
      await onSave(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLabel = (IconComponent, labelText) => (
    <label className={`form-label d-flex align-items-center gap-2 text-${textTheme}`}>
      <IconComponent size={20} />
      {labelText}
    </label>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          {renderLabel(IoPersonOutline, 'Naam')}
          <LabelInput
            name="naam"
            type="text"
            placeholder="Voer de naam van de gebruiker in"
            validationRules={validationRules.naam}
            data-cy="gebruikerNaam_input"
            isInvalid={!!errors.naam}
          />
        </div>

        <div className="mb-4">
          {renderLabel(IoLockClosedOutline, `Wachtwoord ${gebruiker ? '(alleen invullen om te wijzigen)' : ''}`)}
          <LabelInput
            name="wachtwoord"
            type="password"
            placeholder={gebruiker ? "Laat leeg om ongewijzigd te laten" : "Voer wachtwoord in"}
            validationRules={gebruiker ? {} : { required: 'Wachtwoord is verplicht voor nieuwe gebruiker' }}
            data-cy="wachtwoord_input"
            isInvalid={!!errors.wachtwoord}
          />
        </div>

        <div className="mb-5">
          {renderLabel(IoShieldOutline, 'Rechten')}
          <div className={`form-check form-switch ${theme === 'dark' ? 'text-light' : ''}`}>
            <input
              type="checkbox"
              id="isAdmin"
              className="form-check-input"
              {...register('isAdmin')}
              data-cy="admin_role_checkbox"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Geeft toegang tot beheerdersfuncties"
            />
            <label htmlFor="isAdmin" className="form-check-label">
              Administrator rechten
            </label>
          </div>
          <small className={`form-text text-${theme === 'dark' ? 'light' : 'muted'} opacity-75 d-flex align-items-center mt-1`}>
            <IoInformationCircleOutline className="me-1" size={14} />
            Elke gebruiker heeft de gebruikersrol. Selecteer administrator rechten voor uitgebreide toegang.
          </small>
        </div>

        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            data-cy="gebruiker_cancel_btn"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Annuleer zonder opslaan"
          >
            <IoCloseOutline size={18} />
            Annuleren
          </button>

          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center gap-2"
            data-cy="submit_gebruiker"
            disabled={isSubmitting}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={gebruiker ? "Wijzigingen opslaan" : "Nieuwe gebruiker toevoegen"}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Opslaan...
              </>
            ) : (
              <>
                <IoCheckmarkDoneOutline size={18} />
                {gebruiker ? 'Bijwerken' : 'Toevoegen'}
              </>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

