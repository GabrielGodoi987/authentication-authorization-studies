import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cartService } from "@/services/cart.service"
import { cartKeys } from "@/lib/query-keys"
import type { AddProductPayload, UpdateQuantityPayload } from "@/types/cart.type"

export function useCurrentCart() {
  return useQuery({
    queryKey: cartKeys.current(),
    queryFn: cartService.getCurrentCart,
    select: (data) => ({
      ...data,
      isEmpty: data.products.length === 0,
    }),
  })
}

export function useCartDetail(id: string) {
  return useQuery({
    queryKey: cartKeys.detail(id),
    queryFn: () => cartService.getCartById(id),
    enabled: !!id,
  })
}

export function useAddProductToCart(cartId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddProductPayload) =>
      cartService.addProduct(cartId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() })
    },
  })
}

export function useUpdateCartItemQuantity(cartId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      ...payload
    }: UpdateQuantityPayload & { productId: string }) =>
      cartService.updateProductQuantity(cartId, productId, payload),

    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.current() })
      const previousCart = queryClient.getQueryData(cartKeys.current())

      queryClient.setQueryData(cartKeys.current(), (old: unknown) => {
        if (!old || typeof old !== "object" || !("products" in old)) return old
        const cart = old as { products: Array<{ productId: string; quantity: number; unitPrice: number }> }
        return {
          ...cart,
          products: cart.products.map((item) =>
            item.productId === productId
              ? { ...item, quantity, value: quantity * item.unitPrice }
              : item,
          ),
        }
      })

      return { previousCart }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() })
    },
  })
}

export function useRemoveCartItem(cartId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) =>
      cartService.removeProduct(cartId, productId),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.current() })
      const previousCart = queryClient.getQueryData(cartKeys.current())

      queryClient.setQueryData(cartKeys.current(), (old: unknown) => {
        if (!old || typeof old !== "object" || !("products" in old)) return old
        const cart = old as { products: Array<{ productId: string }> }
        return {
          ...cart,
          products: cart.products.filter(
            (item) => item.productId !== productId,
          ),
        }
      })

      return { previousCart }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() })
    },
  })
}

export function useCreateCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartService.createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

export function useDeleteCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cartService.deleteCart(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: cartKeys.all })
    },
  })
}
