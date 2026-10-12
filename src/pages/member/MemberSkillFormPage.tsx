import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import ShellHeader from '../../components/ShellHeader';
import { addAuditLog, getSkills, saveSkill } from '../../lib/storage';

interface Skill {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  type: string;
  category: string;
  installCommand: string;
  license: string;
  version: string;
  tags: string;
  imageUrl: string;
  images?: string[];
  svgCode: string;
  htmlPreview: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

interface SkillForm {
  name: string;
  slug: string;
  summary: string;
  description: string;
  type: string;
  category: string;
  installCommand: string;
  license: string;
  version: string;
  tags: string;
  imageUrl: string;
  images: string[];
  svgCode: string;
  htmlPreview: string;
}

const controlClassName =
  'w-full rounded-[6px] border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-100';

const labelClassName =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400';

const initialForm: SkillForm = {
  name: '',
  slug: '',
  summary: '',
  description: '',
  type: '',
  category: '',
  installCommand: '',
  license: '',
  version: '',
  tags: '',
  imageUrl: '',
  images: [],
  svgCode: '',
  htmlPreview: '',
};

export default function MemberSkillFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<SkillForm>(initialForm);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }

    const skills = getSkills() as Skill[];
    const skill = skills.find(currentSkill => currentSkill.id === id);

    if (skill) {
      setForm({
        name: skill.name ?? '',
        slug: skill.slug ?? '',
        summary: skill.summary ?? '',
        description: skill.description ?? '',
        type: skill.type ?? '',
        category: skill.category ?? '',
        installCommand: skill.installCommand ?? '',
        license: skill.license ?? '',
        version: skill.version ?? '',
        tags: skill.tags ?? '',
        imageUrl: skill.imageUrl ?? '',
        images:
          skill.images && skill.images.length > 0
            ? skill.images
            : skill.imageUrl
              ? [skill.imageUrl]
              : [],
        svgCode: skill.svgCode ?? '',
        htmlPreview: skill.htmlPreview ?? '',
      });
    }
  }, [id]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm(previousForm => ({ ...previousForm, [name]: value }));
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const remainingSlots = 5 - form.images.length;

    if (remainingSlots <= 0 || selectedFiles.length === 0) {
      event.target.value = '';
      return;
    }

    const filesToRead = selectedFiles.slice(0, remainingSlots);
    const fileReaders = filesToRead.map(
      file =>
        new Promise<string>(resolve => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve(typeof reader.result === 'string' ? reader.result : '');
          };

          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(fileReaders).then(results => {
      const newImages = results.filter(Boolean);

      setForm(previousForm => ({
        ...previousForm,
        images: [...previousForm.images, ...newImages].slice(0, 5),
      }));
    });

    event.target.value = '';
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrlInput.trim();

    if (!trimmedUrl || form.images.length >= 5) {
      return;
    }

    setForm(previousForm => ({
      ...previousForm,
      images: [...previousForm.images, trimmedUrl],
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setForm(previousForm => ({
      ...previousForm,
      images: previousForm.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const skills = getSkills() as Skill[];
    const now = new Date().toISOString();
    const skillData = {
      ...form,
      imageUrl: form.images[0] || '',
      images: form.images,
    };

    if (isEditing && id) {
      const index = skills.findIndex(skill => skill.id === id);

      if (index !== -1) {
        skills[index] = {
          ...skills[index],
          ...skillData,
          updatedAt: now,
        };
        saveSkill(skills);
        addAuditLog({
          action: 'update',
          targetId: id,
          details: `Updated skill ${form.name}`,
        });
      }
    } else {
      const newSkill: Skill = {
        id: crypto.randomUUID(),
        ...skillData,
        status: 'draft',
        createdAt: now,
      };
      skills.push(newSkill);
      saveSkill(skills);
      addAuditLog({
        action: 'create',
        targetId: newSkill.id,
        details: `Created skill ${form.name}`,
      });
    }

    navigate('/dashboard/skills');
  };

  const handleCancel = () => {
    navigate('/dashboard/skills');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <ShellHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-500">
            SkillCanvas
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {isEditing ? 'Edit Skill' : 'New Skill'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Configure skill metadata, agent instructions, media previews, and interactive sandboxes.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-[6px] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClassName}>
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={controlClassName}
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className={labelClassName}>
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className={controlClassName}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="summary" className={labelClassName}>
                  Summary
                </label>
                <input
                  id="summary"
                  type="text"
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  className={controlClassName}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className={labelClassName}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={controlClassName}
                  rows={5}
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className={labelClassName}>
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={controlClassName}
                  required
                >
                  <option value="">Select type</option>
                  <option value="tool">Tool</option>
                  <option value="workflow">Workflow</option>
                  <option value="agent">Agent</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className={labelClassName}>
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={controlClassName}
                  required
                />
              </div>

              <div>
                <label htmlFor="installCommand" className={labelClassName}>
                  Install Command
                </label>
                <input
                  id="installCommand"
                  type="text"
                  name="installCommand"
                  value={form.installCommand}
                  onChange={handleChange}
                  className={controlClassName}
                />
              </div>

              <div>
                <label htmlFor="license" className={labelClassName}>
                  License
                </label>
                <input
                  id="license"
                  type="text"
                  name="license"
                  value={form.license}
                  onChange={handleChange}
                  className={controlClassName}
                />
              </div>

              <div>
                <label htmlFor="version" className={labelClassName}>
                  Version
                </label>
                <input
                  id="version"
                  type="text"
                  name="version"
                  value={form.version}
                  onChange={handleChange}
                  className={controlClassName}
                />
              </div>

              <div>
                <label htmlFor="tags" className={labelClassName}>
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className={controlClassName}
                  placeholder="tag1, tag2"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[6px] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Image &amp; Media Preview Gallery</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Add up to five images for the skill preview.
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                Images ({form.images.length}/5)
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="imageUpload" className={labelClassName}>
                  Upload Images
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFileChange}
                  className={`${controlClassName} file:mr-3 file:rounded-[4px] file:border-0 file:bg-neutral-100 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-neutral-700 dark:file:bg-neutral-800 dark:file:text-neutral-300`}
                />
              </div>

              <div>
                <label htmlFor="imageUrlInput" className={labelClassName}>
                  Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="imageUrlInput"
                    type="url"
                    value={imageUrlInput}
                    onChange={event => setImageUrlInput(event.target.value)}
                    className={controlClassName}
                    placeholder="https://example.com/image.png"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={form.images.length >= 5 || !imageUrlInput.trim()}
                    className="shrink-0 rounded-[6px] border border-neutral-300 px-3 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    + Add URL
                  </button>
                </div>
              </div>
            </div>

            {form.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {form.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative">
                    <div className="aspect-video overflow-hidden rounded-[6px] border border-neutral-200 dark:border-neutral-800">
                      <img
                        src={image}
                        alt={`Skill preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-neutral-950/80 px-1.5 py-1 text-[10px] font-semibold text-white">
                      {index === 0 ? 'Cover #1' : `#${index + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute right-1.5 top-1.5 rounded-[4px] bg-white/90 p-1.5 text-neutral-700 transition-colors hover:bg-white dark:bg-neutral-950/90 dark:text-neutral-300 dark:hover:bg-neutral-950"
                    >
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[6px] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold">SVG Vector Diagram Code</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Add SVG markup to render a vector diagram preview.
              </p>
            </div>

            <label htmlFor="svgCode" className={labelClassName}>
              SVG Code
            </label>
            <textarea
              id="svgCode"
              name="svgCode"
              value={form.svgCode}
              onChange={handleChange}
              className={`${controlClassName} font-mono text-xs`}
              rows={8}
              placeholder='<svg viewBox="0 0 100 100">...</svg>'
            />

            {form.svgCode && (
              <div className="mt-4 rounded-[6px] border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  SVG Preview
                </p>
                <div
                  className="flex min-h-24 items-center justify-center overflow-auto"
                  dangerouslySetInnerHTML={{ __html: form.svgCode }}
                />
              </div>
            )}
          </section>

          <section className="rounded-[6px] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold">Interactive HTML Sandbox</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Provide isolated HTML content for an interactive preview.
              </p>
            </div>

            <label htmlFor="htmlPreview" className={labelClassName}>
              HTML Preview Code
            </label>
            <textarea
              id="htmlPreview"
              name="htmlPreview"
              value={form.htmlPreview}
              onChange={handleChange}
              className={`${controlClassName} font-mono text-xs`}
              rows={8}
              placeholder="<div><h3>Preview</h3><p>Your HTML content</p></div>"
            />

            {form.htmlPreview && (
              <div className="mt-4 overflow-hidden rounded-[6px] border border-neutral-200 dark:border-neutral-800">
                <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                  HTML Preview
                </div>
                <iframe
                  title="HTML sandbox preview"
                  srcDoc={form.htmlPreview}
                  sandbox=""
                  className="min-h-48 w-full border-0 bg-white dark:bg-neutral-900"
                />
              </div>
            )}
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-[6px] border border-neutral-300 px-5 py-2.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-neutral-950 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Save Skill
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
