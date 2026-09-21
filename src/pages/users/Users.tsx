import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { Add01Icon } from "@hugeicons/core-free-icons";

import { toast } from "sonner";

import {
  searchUsers,
  deleteUser,
  activateUser,
  deactivateUser,
 
} from "../../api/userApi";

import type { PageResponse } from "../../types/common";
import type { User } from "../../types/user";

import UserTable from "../../components/users/UserTable";
import UserForm from "../../components/users/UserForm";
import UserEditForm from "../../components/users/UserEditForm";
import ResetPasswordDialog from "../../components/users/ResetPasswordDialog";

import ConfirmDialog from "../../components/common/ConfirmDialog";
import FormDialog from "../../components/common/FormDialog";
import SearchField from "../../components/common/SearchField";
import PageActionButton from "../../components/common/PageActionButton";
import TablePagination from "../../components/common/TablePagination";
import DataTableCard from "../../components/common/DataTableCard";
import FilterBar from "../../components/common/FilterBar";
import FilterSelect from "../../components/common/FilterSelect";

import { useBounce } from "../../hooks/useDebounce";

const PAGE_SIZE = 10;

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useBounce(searchInput, 400);

  const [activeFilter, setActiveFilter] = useState<"ACTIVE" | "INACTIVE" | "">(
    "",
  );
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [changingStatus, setChangingStatus] = useState(false);
  const hasActiveFilters = activeFilter !== "";

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data: PageResponse<User> = await searchUsers({
        username: debouncedSearch || undefined,

        active: activeFilter === "" ? undefined : activeFilter === "ACTIVE",

        page,
        size: PAGE_SIZE,
        sort: "userId,desc",
      });

      setUsers(data.content);

      setTotalPages(data.totalPages);

      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to load users:", error);

      setError("Unable to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch, activeFilter]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, activeFilter]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleCloseUserDialog = () => {
    setUserDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUserSuccess = async () => {
    const isEditing = !!selectedUser;

    handleCloseUserDialog();

    await loadUsers();

    toast.success(
      isEditing ? "User updated successfully" : "User created successfully",
    );
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setResetPasswordOpen(true);
  };

  const handleCloseResetPassword = () => {
    setResetPasswordOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) {
      return;
    }
    try {
      setDeleting(true);
      await deleteUser(selectedUser.userId);
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete user. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (deleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleChangeStatus = (user: User) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    if (changingStatus) {
      return;
    }

    setStatusDialogOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmStatus = async () => {
    if (!selectedUser) {
      return;
    }
    try {
      setChangingStatus(true);
      if (selectedUser.active) {
        await deactivateUser(selectedUser.userId);
        toast.success("User deactivated successfully");
      } else {
        await activateUser(selectedUser.userId);
        toast.success("User activated successfully");
      }

      setStatusDialogOpen(false);
      setSelectedUser(null);

      await loadUsers();
    } catch (error: any) {
      console.error("Failed to change user status:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to change user status. Please try again.",
      );
    } finally {
      setChangingStatus(false);
    }
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setActiveFilter("");
    setPage(0);
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        width: "100%",
        pb: 5,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1.8,
          width: "100%",
        }}
      >
        <SearchField
          value={searchInput}
          onChange={(value) => {
            setSearchInput(value);
            setPage(0);
          }}
          placeholder="Search users..."
        />

        <PageActionButton
          label="Add User"
          icon={Add01Icon}
          onClick={handleAddUser}
        />
      </Box>

      <FilterBar showClear={hasActiveFilters} onClear={handleClearFilters}>
        <FilterSelect
          value={activeFilter}
          onChange={(value) => {
            setActiveFilter(value as "ACTIVE" | "INACTIVE" | "");

            setPage(0);
          }}
          placeholder="Status"
          width={145}
          options={[
            {
              value: "ACTIVE",
              label: "Active",
            },
            {
              value: "INACTIVE",
              label: "Inactive",
            },
          ]}
        />
      </FilterBar>

      <DataTableCard
        loading={loading}
        error={error}
        empty={users.length === 0}
        emptyMessage="No users found."
      >
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onResetPassword={handleResetPassword}
          onChangeStatus={handleChangeStatus}
          onDelete={handleDeleteUser}
        />

        <TablePagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      </DataTableCard>

      <FormDialog
        open={userDialogOpen}
        title={selectedUser ? "Edit User" : "Create User"}
        onClose={handleCloseUserDialog}
        maxWidth="sm"
      >
        {selectedUser ? (
          <UserEditForm
            user={selectedUser}
            onSuccess={handleUserSuccess}
            onCancel={handleCloseUserDialog}
          />
        ) : (
          <UserForm
            onSuccess={handleUserSuccess}
            onCancel={handleCloseUserDialog}
          />
        )}
      </FormDialog>

      <ResetPasswordDialog
        open={resetPasswordOpen}
        user={selectedUser}
        onClose={handleCloseResetPassword}
        onSuccess={async () => {
          handleCloseResetPassword();

          toast.success("Password reset successfully");
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        itemName={selectedUser ? selectedUser.username : undefined}
        confirmText="Delete User"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ConfirmDialog
        open={statusDialogOpen}
        title={selectedUser?.active ? "Deactivate User" : "Activate User"}
        message={
          selectedUser?.active
            ? "Are you sure you want to deactivate this user? They will no longer be able to log in."
            : "Are you sure you want to activate this user? They will be able to log in again."
        }
        itemName={selectedUser ? selectedUser.username : undefined}
        confirmText={selectedUser?.active ? "Deactivate User" : "Activate User"}
        loading={changingStatus}
        onConfirm={handleConfirmStatus}
        onCancel={handleCloseStatusDialog}
      />
    </Box>
  );
};

export default Users;
