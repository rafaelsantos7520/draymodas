'use client'
import { useState, useEffect } from 'react'

interface Item {
  id: string
  name: string
}

export default function SettingsPage() {
  const [categories, setCategories] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (!response.ok) throw new Error('Erro ao carregar categorias')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (name: string) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      if (!response.ok) throw new Error('Erro ao adicionar categoria')

      const newCategory = await response.json()
      setCategories([...categories, newCategory])
    } catch (err) {
      setError('Erro ao adicionar categoria')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao excluir categoria')

      setCategories(categories.filter(category => category.id !== id))
    } catch (err) {
      setError('Erro ao excluir categoria')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="max-w-2xl">
        {/* Categorias */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Categorias</h2>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex justify-between items-center">
                <span>{category.name}</span>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const input = e.currentTarget.querySelector('input') as HTMLInputElement
                if (input.value.trim()) {
                  handleAdd(input.value.trim())
                  input.value = ''
                }
              }}
              className="flex gap-2 mt-4"
            >
              <input
                type="text"
                placeholder="Nova categoria"
                className="flex-1 p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Adicionar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 