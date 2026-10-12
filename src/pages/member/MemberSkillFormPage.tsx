import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSkills, saveSkill, addAuditLog } from '../../lib/storage';

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
  svgCode: string;
  htmlPreview: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export default function MemberSkillFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
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
    svgCode: '',
    htmlPreview: '',
  });

  useEffect(() => {
    if (id) {
      const skills = getSkills() as Skill[];
      const skill = skills.find(s => s.id === id);
      if (skill) {
        setForm({
          name: skill.name,
          slug: skill.slug,
          summary: skill.summary,
          description: skill.description,
          type: skill.type,
          category: skill.category,
          installCommand: skill.installCommand,
          license: skill.license,
          version: skill.version,
          tags: skill.tags,
          imageUrl: skill.imageUrl ?? '',
          svgCode: skill.svgCode ?? '',
          htmlPreview: skill.htmlPreview ?? '',
        });
      }
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = typeof reader.result === 'string' ? reader.result : '';
      if (resultUrl) {
        setForm(prev => ({ ...prev, imageUrl: resultUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = getSkills() as Skill[];
    const now = new Date().toISOString();

    if (isEditing && id) {
      const index = skills.findIndex(s => s.id === id);
      if (index !== -1) {
        skills[index] = { ...skills[index], ...form, updatedAt: now };
        saveSkill(skills);
        addAuditLog({ action: 'update', targetId: id, details: `Updated skill ${form.name}` });
      }
    } else {
      const newSkill: Skill = {
        id: crypto.randomUUID(),
        ...form,
        status: 'draft',
        createdAt: now,
      };
      skills.push(newSkill);
      saveSkill(skills);
      addAuditLog({ action: 'create', targetId: newSkill.id, details: `Created skill ${form.name}` });
    }

    navigate('/dashboard/skills');
  };

  const handleCancel = () => {
    navigate('/dashboard/skills');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Skill' : 'New Skill'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <input type="text" name="summary" value={form.summary} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={4} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select type</option>
            <option value="tool">Tool</option>
            <option value="workflow">Workflow</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Install Command</label>
          <input type="text" name="installCommand" value={form.installCommand} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">License</label>
          <input type="text" name="license" value={form.license} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Version</label>
          <input type="text" name="version" value={form.version} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input type="text" name="tags" value={form.tags} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="tag1, tag2" />
        </div>

        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Image & CDN Upload Area</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageFileChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Direct Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com/image.png"
            />
          </div>

          {form.imageUrl && (
            <div className="border rounded-lg p-3 bg-gray-50">
              <p className="text-sm font-medium mb-2">Image Preview</p>
              <img src={form.imageUrl} alt="Skill preview" className="max-h-48 max-w-full rounded object-contain" />
            </div>
          )}
        </section>

        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">SVG Vector Diagram Code</h2>

          <div>
            <label className="block text-sm font-medium mb-1">SVG Code</label>
            <textarea
              name="svgCode"
              value={form.svgCode}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              rows={8}
              placeholder="<svg viewBox=&quot;0 0 100 100&quot;>...</svg>"
            />
          </div>

          {form.svgCode && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium mb-2">SVG Preview</p>
              <div className="min-h-24 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: form.svgCode }} />
            </div>
          )}
        </section>

        <section className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Interactive HTML Sandbox</h2>

          <div>
            <label className="block text-sm font-medium mb-1">HTML Preview Code</label>
            <textarea
              name="htmlPreview"
              value={form.htmlPreview}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              rows={8}
              placeholder="<div><h3>Preview</h3><p>Your HTML content</p></div>"
            />
          </div>

          {form.htmlPreview && (
            <div className="border rounded-lg overflow-hidden bg-white">
              <p className="text-sm font-medium px-3 py-2 bg-gray-50 border-b">HTML Preview</p>
              <iframe
                title="HTML sandbox preview"
                srcDoc={form.htmlPreview}
                sandbox=""
                className="w-full min-h-48 border-0"
              />
            </div>
          )}
        </section>

        <div className="flex gap-4">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
        </div>
      </form>
    </div>
  );
}
