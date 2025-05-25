"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  description: string;
  images: {
    id: string;
    url: string;
    productId: string;
    createdAt: string;
    updatedAt: string;
  }[];
  category: { id: string; name: string; createdAt: string; updatedAt: string };
  isActive: boolean;
  isReady: boolean;
  createdAt: string;
  updatedAt: string;
  price: number;
  code: string;
  adminId: string;
  categoryId: string;
  sizes: { size: { id: string; name: string } }[];
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Size {
  id: string;
  name: string;
  description: string;
}

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [productRes, categoriesRes, sizesRes] = await Promise.all([
        fetch(`/api/admin/products/${id}`),
        fetch("/api/admin/categories"),
        fetch("/api/admin/sizes"),
      ]);

      if (!productRes.ok) throw new Error("Erro ao carregar produto");
      if (!categoriesRes.ok) throw new Error("Erro ao carregar categorias");
      if (!sizesRes.ok) throw new Error("Erro ao carregar tamanhos");

      const [productData, categoriesData, sizesData] = await Promise.all([
        productRes.json(),
        categoriesRes.json(),
        sizesRes.json(),
      ]);

      setProduct(productData);
      setCategories(categoriesData);
      setSizes(sizesData);
    } catch (err) {
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    try {
      const response = await axios.put(`/api/admin/products/${id}`, {
        name: product.name,
        description: product.description,
        categoryId: product.category.id,
        isActive: product.isActive,
        isReady: product.isReady,
        price: product.price,
        sizeIds: product.sizes.map((s) => s.size.id),
      });

      if (response.status !== 200) throw new Error("Erro ao salvar produto");

      router.push("/admin/produtos");
    } catch (err) {
      setError("Erro ao salvar produto");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !product) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `/api/admin/products/${id}/images`,
        formData
      );

      if (response.status !== 200)
        throw new Error("Erro ao fazer upload da imagem");

      const newImage = response.data;
      setProduct({
        ...product,
        images: [...product.images, newImage],
      });
    } catch (err) {
      setError("Erro ao fazer upload da imagem");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!product) return;

    try {
      const response = await axios.delete(
        `/api/admin/products/${id}/images/${imageId}`
      );

      if (response.status !== 200) throw new Error("Erro ao excluir imagem");

      setProduct({
        ...product,
        images: product.images.filter((img) => img.id !== imageId),
      });
    } catch (err) {
      setError("Erro ao excluir imagem");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Produto não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Produto</h1>
        <button
          onClick={() => router.push("/admin/produtos")}
          className="text-gray-600 hover:text-gray-800"
        >
          Voltar
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço
            </label>
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={product.category.id}
              onChange={(e) => {
                const category = categories.find(
                  (c) => c.id === e.target.value
                );
                if (category) {
                  setProduct({
                    ...product,
                    category: {
                      id: category.id,
                      name: category.name,
                      createdAt: category.createdAt,
                      updatedAt: category.updatedAt,
                    },
                  });
                }
              }}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamanhos Disponíveis
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sizes.map((size) => (
                <label key={size.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={product.sizes.some((s) => s.size.id === size.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProduct({
                          ...product,
                          sizes: [
                            ...product.sizes,
                            { size: { id: size.id, name: size.name } },
                          ],
                        });
                      } else {
                        setProduct({
                          ...product,
                          sizes: product.sizes.filter(
                            (s) => s.size.id !== size.id
                          ),
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{size.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={product.isActive}
                onChange={(e) =>
                  setProduct({ ...product, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Ativo</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={product.isReady}
                onChange={(e) =>
                  setProduct({ ...product, isReady: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Pronto para exibição
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagens
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {product.images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/produtos")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
