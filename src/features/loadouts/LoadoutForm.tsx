import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addLoadout, editLoadout } from './loadoutSlice';
import { Loadout } from '../../api/mockApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LoadoutFormProps {
  existingLoadout?: Loadout;
  onClose: () => void;
}

const WEAPONS = ['Peashooter', 'Spread', 'Chaser', 'Lobber', 'Charge', 'Roundabout'];
const CHARMS = ['Smoke Bomb', 'P. Sugar', 'Coffee', 'Heart', 'Twin Heart', 'Whetstone'];
const SUPERS = ['Energy Beam', 'Invincibility', 'Giant Ghost'];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  weaponPrimary: z.string(),
  weaponSecondary: z.string(),
  charm: z.string(),
  superMove: z.string(),
});

export const LoadoutForm: React.FC<LoadoutFormProps> = ({ existingLoadout, onClose }) => {
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingLoadout?.name || '',
      weaponPrimary: existingLoadout?.weaponPrimary || WEAPONS[0],
      weaponSecondary: existingLoadout?.weaponSecondary || WEAPONS[1],
      charm: existingLoadout?.charm || CHARMS[0],
      superMove: existingLoadout?.superMove || SUPERS[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (existingLoadout) {
      await dispatch(editLoadout({ ...values, id: existingLoadout.id }));
    } else {
      await dispatch(addLoadout(values));
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card border-4 border-border text-foreground transform rotate-[0.5deg] shadow-2xl">
        <DialogHeader className="border-b-2 border-border pb-4">
          <DialogTitle className="text-3xl font-display text-primary uppercase">
            {existingLoadout ? 'Modify Setup' : 'New Contract'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-lg uppercase">Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SLAYER..."
                      {...field}
                      className="bg-background border-2 border-border font-bold uppercase"
                    />
                  </FormControl>
                  <FormMessage className="text-primary font-bold italic" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6 bg-secondary/10 p-4 border-2 border-border border-dashed rounded-md">
              <FormField
                control={form.control}
                name="weaponPrimary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display uppercase">Shot A</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-2 border-border font-bold uppercase">
                          <SelectValue placeholder="Weapon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-2 border-border">
                        {WEAPONS.map((w) => (
                          <SelectItem
                            key={w}
                            value={w}
                            className="font-bold uppercase focus:bg-primary focus:text-white"
                          >
                            {w}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weaponSecondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display uppercase">Shot B</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-2 border-border font-bold uppercase">
                          <SelectValue placeholder="Weapon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-2 border-border">
                        {WEAPONS.map((w) => (
                          <SelectItem
                            key={w}
                            value={w}
                            className="font-bold uppercase focus:bg-primary focus:text-white"
                          >
                            {w}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="charm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-lg uppercase">Magic Charm</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-2 border-border font-bold uppercase">
                        <SelectValue placeholder="Select charm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-2 border-border">
                      {CHARMS.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                          className="font-bold uppercase focus:bg-primary focus:text-white"
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="superMove"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-lg uppercase">Super Art</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-2 border-border font-bold uppercase">
                        <SelectValue placeholder="Select super" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-2 border-border">
                      {SUPERS.map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="font-bold uppercase focus:bg-primary focus:text-white"
                        >
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6 border-t-2 border-border gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-2 border-border font-display uppercase hover:bg-muted"
              >
                Cease!
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white border-2 border-border font-display uppercase shadow-md px-8 text-lg"
              >
                Sign!
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
