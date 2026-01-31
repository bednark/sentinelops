"use client";

import { useState, useEffect } from "react";
import AgentsManagementHeader from "@/components/agents/agents-management/AgentsManagementHeader";
import AgentsManagementTable from "@/components/agents/agents-management/AgentsManagementTable";
import DeleteDialog from "@/components/agents/agents-management/dialogs/DeleteDialog";
import RenameDialog from "@/components/agents/agents-management/dialogs/RenameDialog";
import RotateTokenDialog from "@/components/agents/agents-management/dialogs/RotateTokenDialog";
import { gql } from "@apollo/client";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { AgentManagment } from "@/lib/types";

const AGENTS_QUERY = gql`
  query Agents {
    agents {
      id
      name
      createdAt
    }
  }
`;

const ADD_AGENT_MUTATION = gql`
  mutation AddAgent($input: AddAgent!) {
    addAgent(input: $input) {
      id
      name
      token
    }
  }
`;

type AddAgentResponse = {
  addAgent: {
    id: string;
    name: string;
    token: string;
    createdAt: string;
  };
};

type AddAgentVariables = {
  input: {
    name: string;
  };
};

type AgentsQueryResponse = {
  agents: AgentManagment[];
}

export default function AgentManagementPage() {
  const [fetchAgents, { data, loading: agentsLoading }] =
    useLazyQuery<AgentsQueryResponse>(AGENTS_QUERY, {
      fetchPolicy: "network-only",
    });
  const [addAgent, { loading: addLoading }] = useMutation<AddAgentResponse, AddAgentVariables>(ADD_AGENT_MUTATION);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const agents = data?.agents ?? [];

  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    agentId?: string;
    currentName?: string;
  }>({ open: false });

  const [rotateDialog, setRotateDialog] = useState<{
    step: "confirm" | "token" | null;
    agentId?: string;
    agentName?: string;
    token?: string;
  }>({ step: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    agentId?: string;
    agentName?: string;
  }>({ open: false });

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleDelete = async (agentId: string) => {
  };

  const handleRotateToken = async (agentId: string) => {
    setRotateDialog((prev) => {
      if (!prev.agentId) return prev;

      return {
        ...prev,
        step: "token",
        token: "nowytoken123",
      };
    });
  };

  const handleRename = async (agentId: string) => {
  };

  const [addError, setAddError] = useState("");

  const handleAddAgent = async (agentName: string) => {
    setAddError("");

    try {
      const result = await addAgent({
        variables: {
          input: { name: agentName },
        },
      });

      const newAgent = result.data?.addAgent;

      if (!newAgent) {
        setAddError("Nie udało się utworzyć agenta. Spróbuj ponownie.");
        return;
      }

      setAddDialogOpen(false);

      setRotateDialog({
        step: "token",
        agentId: newAgent.id,
        agentName: newAgent.name,
        token: newAgent.token,
      });

      fetchAgents();
    } catch (e: any) {
      setAddError("Wystąpił błąd podczas tworzenia agenta");
    }
  };

  if (agentsLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <p className="text-slate-400">Loading agents...</p>
        </div>
      </div>
    );
  }

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setAddError("");
  }

  return (
    <div className="p-8">
      <AgentsManagementHeader
        open={addDialogOpen}
        addError={addError}
        onOpen={() => setAddDialogOpen(true)}
        onClose={closeAddDialog}
        onSubmit={handleAddAgent}
        isAdding={addLoading}
      />
      <AgentsManagementTable
        agents={agents}
        onRename={(agent) =>
          setRenameDialog({
            open: true,
            agentId: agent.id,
            currentName: agent.name,
          })
        }
        onRotateToken={(agent) =>
          setRotateDialog({
            step: "confirm",
            agentId: agent.id,
            agentName: agent.name,
          })
        }
        onDelete={(agent) =>
          setDeleteDialog({
            open: true,
            agentId: agent.id,
            agentName: agent.name,
          })
        }
      />


      <RenameDialog
        open={renameDialog.open}
        agentId={renameDialog.agentId}
        currentName={renameDialog.currentName}
        onConfirm={handleRename}
        onClose={() => setRenameDialog({ open: false })}
      />

      <RotateTokenDialog
        step={rotateDialog.step}
        agentId={rotateDialog.agentId}
        agentName={rotateDialog.agentName}
        token={rotateDialog.token}
        onConfirm={handleRotateToken}
        onClose={() => setRotateDialog({ step: null })}
      />

      <DeleteDialog
        open={deleteDialog.open}
        agentId={deleteDialog.agentId}
        agentName={deleteDialog.agentName}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={handleDelete}
      />
    </div>
  );
}
