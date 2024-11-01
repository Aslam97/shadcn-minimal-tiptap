import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { MinimalTiptapEditor } from '../minimal-tiptap'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z
    .string({
      required_error: 'Description is required'
    })
    .min(1, 'Description is required')
})

type FormValues = z.infer<typeof formSchema>

export function DialogFormExample() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const onSubmit = (values: FormValues) => {
    console.log('==Getting values from form==')
    console.log(values)
    console.log('Success: Values retrieved from form')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogDescription>Fill in the form below to create a new post.</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Title"
                        className={cn('w-full', {
                          'border-destructive focus-visible:ring-0': form.formState.errors.title
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Description</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        {...field}
                        throttleDelay={0}
                        className={cn('h-full min-h-56 w-full rounded-xl', {
                          'border-destructive focus-within:border-destructive': form.formState.errors.description
                        })}
                        editorContentClassName="overflow-auto h-full flex grow"
                        output="html"
                        placeholder="Type your description here..."
                        editable={true}
                        editorClassName="focus:outline-none px-5 py-4 h-full grow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              form.handleSubmit(onSubmit)()
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
