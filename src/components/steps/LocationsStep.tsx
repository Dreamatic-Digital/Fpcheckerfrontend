import React from 'react';
import { FormData } from '../../App';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, X } from 'lucide-react';

interface LocationsStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export function LocationsStep({ formData, updateFormData }: LocationsStepProps) {
  const australianStates = [
    { value: 'NSW', label: 'NSW' },
    { value: 'VIC', label: 'VIC' },
    { value: 'QLD', label: 'QLD' },
    { value: 'SA', label: 'SA' },
    { value: 'ACT', label: 'ACT' },
    { value: 'TAS', label: 'TAS' },
    { value: 'NT', label: 'NT' },
    { value: 'WA', label: 'WA' }
  ];

  const addOffice = () => {
    updateFormData({
      offices: [...formData.offices, { postal: '', city: '', state: '', employees: undefined as any }]
    });
  };

  const removeOffice = (index: number) => {
    const newOffices = formData.offices.filter((_, i) => i !== index);
    updateFormData({ offices: newOffices });
  };

  const updateOffice = (index: number, field: string, value: string | number) => {
    const newOffices = [...formData.offices];
    newOffices[index] = { ...newOffices[index], [field]: value };
    updateFormData({ offices: newOffices });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-2xl text-gray-800 mb-6 text-center">Company Locations</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Headquarters Location</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="hqPostalCode">HQ Postal Code</Label>
              <Input
                id="hqPostalCode"
                value={formData.hqPostalCode}
                onChange={(e) => updateFormData({ hqPostalCode: e.target.value })}
                placeholder="e.g., 10001"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="hqCity">City</Label>
              <Input
                id="hqCity"
                value={formData.hqCity}
                onChange={(e) => updateFormData({ hqCity: e.target.value })}
                placeholder="Enter city"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="hqState">State/Province</Label>
              <Select value={formData.hqState} onValueChange={(value) => updateFormData({ hqState: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {australianStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hqEmployees">Employee Count</Label>
              <Input
                id="hqEmployees"
                type="number"
                value={formData.hqEmployees || ''}
                onChange={(e) => updateFormData({ hqEmployees: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
                placeholder=""
                min="0"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Other Office Locations (Optional)</h3>
          
          {formData.offices.map((office, index) => (
            <div key={index} className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label>Postal Code</Label>
                <Input
                  value={office.postal}
                  onChange={(e) => updateOffice(index, 'postal', e.target.value)}
                  placeholder="e.g., 90210"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={office.city}
                  onChange={(e) => updateOffice(index, 'city', e.target.value)}
                  placeholder="Enter city"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>State/Province</Label>
                <Select value={office.state} onValueChange={(value) => updateOffice(index, 'state', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {australianStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Employee Count</Label>
                  <Input
                    type="number"
                    value={office.employees || ''}
                    onChange={(e) => updateOffice(index, 'employees', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                    placeholder=""
                    min="0"
                    className="mt-2"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeOffice(index)}
                  className="mt-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addOffice}
            className="mt-4 text-blue-700 border-blue-200 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Office Location
          </Button>
        </div>
      </div>
    </div>
  );
}