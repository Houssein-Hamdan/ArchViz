import { useState } from 'react';
import toast from 'react-hot-toast';
import DiagramCanvas from '../DiagramEditor/DiagramCanvas';
import ImplementationPlan from './ImplementationPlan';
import DatabaseDesign from './DatabaseDesign';
import { architectureService } from '../../services/architectureService';
import {
  MessageCircle,
  Grid,
  Zap,
  Save,
  CheckSquare,
  Database,
} from 'lucide-react';
export default function DiagramTabs({
  architecture,
  title,
  onArchitectureUpdate,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  if (!architecture) {
    return null;
  }
  /*
   * Normalize architecture data
   *
   * Supports:
   *
   * architecture.diagram_json
   * architecture.data
   * architecture
   */
  const diagram =
    architecture?.diagram_json ??
    architecture?.data ??
    architecture ??
    {};
  /*
   * Save architecture
   */
  const handleSave = async (diagramChanges = null) => {
    try {
      setIsSaving(true);
      const diagramJson = diagramChanges || diagram;
      const response = await architectureService.saveArchitecture(
        title,
        architecture.prompt_input,
        architecture.tech_stack,
        diagramJson,
        diagram?.tradeoffs || null
      );
      const shareLink = `${window.location.origin}/share/${response.data.share_slug}`;
      try {
        await navigator.clipboard.writeText(shareLink);
        toast.success(
          'Architecture saved and share link copied!'
        );
      } catch {
        toast.success(
          'Architecture saved successfully!'
        );
      }
      if (onArchitectureUpdate) {
        onArchitectureUpdate(response.data);
      }
    } catch (error) {
      console.error('Save architecture error:', error);
      toast.error(
        error?.response?.data?.message ||
          'Failed to save architecture'
      );
    } finally {
      setIsSaving(false);
    }
  };
  /*
   * Database count
   */
  const databaseEntities = Array.isArray(
    diagram?.database?.entities
  )
    ? diagram.database.entities
    : Array.isArray(diagram?.database?.tables)
      ? diagram.database.tables
      : [];
  /*
   * Tabs
   */
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: MessageCircle,
    },
    {
      id: 'diagram',
      label: 'Diagram',
      icon: Grid,
    },
    {
      id: 'flow',
      label: 'Flow',
      icon: Zap,
    },
    {
      id: 'implementation',
      label: 'Implementation',
      icon: CheckSquare,
    },
    {
      id: 'database',
      label: 'Database',
      icon: Database,
      count: databaseEntities.length,
    },
  ];
  return (
    <div
      className="
        w-full
        h-full
        min-h-0
        flex
        flex-col
        bg-white
        dark:bg-gray-900
        rounded-lg
        overflow-hidden
      "
    >
      {/* ================================================== */}
      {/* TABS HEADER */}
      {/* ================================================== */}
      <div
        className="
          flex
          items-center
          flex-shrink-0
          border-b
          border-gray-200
          dark:border-gray-700
          bg-white
          dark:bg-gray-800
        "
      >
        {/* Scrollable tabs */}
        <div
          className="
            flex-1
            min-w-0
            overflow-x-auto
            scrollbar-hide
          "
        >
          <div className="flex w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`
                    flex
                    items-center
                    gap-2
                    px-3
                    sm:px-4
                    py-3
                    text-sm
                    font-medium
                    whitespace-nowrap
                    border-b-2
                    transition
                    ${
                      isActive
                        ? `
                          border-blue-600
                          text-blue-600
                          dark:border-blue-400
                          dark:text-blue-400
                        `
                        : `
                          border-transparent
                          text-gray-600
                          dark:text-gray-400
                          hover:text-gray-900
                          dark:hover:text-gray-200
                          hover:bg-gray-50
                          dark:hover:bg-gray-700/50
                        `
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-5
                        h-5
                        px-1.5
                        rounded-full
                        bg-gray-100
                        dark:bg-gray-700
                        text-xs
                        text-gray-600
                        dark:text-gray-300
                      "
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Save */}
        <div
          className="
            flex-shrink-0
            border-l
            border-gray-200
            dark:border-gray-700
            px-2
            sm:px-3
          "
        >
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-3
              sm:px-4
              py-2
              bg-blue-600
              hover:bg-blue-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              rounded-lg
              transition
              text-sm
              font-medium
              whitespace-nowrap
            "
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isSaving ? 'Saving...' : 'Save'}
            </span>
          </button>
        </div>
      </div>
      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}
      <div
        className="
          flex-1
          min-h-0
          relative
          overflow-hidden
        "
      >
        {/* ================= OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div
            className="
              absolute
              inset-0
              overflow-y-auto
              overscroll-contain
            "
          >
            <OverviewTab
              diagram={diagram}
            />
          </div>
        )}
        {/* ================= DIAGRAM ================= */}
        {activeTab === 'diagram' && (
          <div
            className="
              absolute
              inset-0
              overflow-hidden
            "
          >
            <DiagramCanvas
              diagramData={diagram}
              onSaveChanges={handleSave}
            />
          </div>
        )}
        {/* ================= FLOW ================= */}
        {activeTab === 'flow' && (
          <div
            className="
              absolute
              inset-0
              overflow-y-auto
              overscroll-contain
            "
          >
            <FlowTab
              diagram={diagram}
            />
          </div>
        )}
        {/* ================= IMPLEMENTATION ================= */}
        {activeTab === 'implementation' && (
          <div
            className="
              absolute
              inset-0
              overflow-y-auto
              overscroll-contain
              p-4
              sm:p-6
              lg:p-8
            "
          >
            <ImplementationPlan
              implementation={
                diagram?.implementation
              }
            />
          </div>
        )}
        {/* ================= DATABASE ================= */}
        {activeTab === 'database' && (
          <div
            className="
              absolute
              inset-0
              overflow-y-auto
              overscroll-contain
            "
          >
            <DatabaseDesign
              architecture={{
                ...architecture,
                diagram_json: diagram,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
/* ====================================================== */
/* OVERVIEW */
/* ====================================================== */
function OverviewTab({ diagram }) {
  const nodes = Array.isArray(diagram?.nodes)
    ? diagram.nodes
    : [];
  const edges = Array.isArray(diagram?.edges)
    ? diagram.edges
    : [];
  const flow = Array.isArray(diagram?.flow)
    ? diagram.flow
    : [];
  const decisions = Array.isArray(
    diagram?.decisions
  )
    ? diagram.decisions
    : [];
  const tradeoffs = diagram?.tradeoffs;
  return (
    <div
      className="
        w-full
        p-4
        sm:p-6
        lg:p-8
      "
    >
      <div
        className="
          max-w-6xl
          mx-auto
          space-y-6
          sm:space-y-8
        "
      >
        {/* Header */}
        <div>
          <h2
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-gray-900
              dark:text-gray-50
            "
          >
            Architecture Overview
          </h2>
          <p
            className="
              mt-2
              text-gray-600
              dark:text-gray-400
              leading-relaxed
            "
          >
            A high-level overview of the generated
            system architecture, its components,
            communication flow, technical decisions,
            and trade-offs.
          </p>
        </div>
        {/* Summary */}
        {diagram?.summary && (
          <section
            className="
              bg-blue-50
              dark:bg-blue-900/20
              border
              border-blue-200
              dark:border-blue-800
              rounded-xl
              p-5
              sm:p-6
            "
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle
                className="
                  w-5
                  h-5
                  text-blue-600
                  dark:text-blue-400
                "
              />
              <h3
                className="
                  text-lg
                  font-bold
                  text-gray-900
                  dark:text-gray-50
                "
              >
                Summary
              </h3>
            </div>
            <p
              className="
                text-gray-700
                dark:text-gray-300
                leading-7
                break-words
              "
            >
              {diagram.summary}
            </p>
          </section>
        )}
        {/* Statistics */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-4
            gap-3
            sm:gap-4
          "
        >
          <StatCard
            label="Components"
            value={nodes.length}
          />
          <StatCard
            label="Connections"
            value={edges.length}
          />
          <StatCard
            label="Flow Steps"
            value={flow.length}
          />
          <StatCard
            label="Decisions"
            value={decisions.length}
          />
        </div>
        {/* Components */}
        {nodes.length > 0 && (
          <section>
            <h3
              className="
                text-xl
                font-bold
                text-gray-900
                dark:text-gray-50
                mb-4
              "
            >
              Components
            </h3>
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="
                    bg-white
                    dark:bg-gray-800
                    border
                    border-gray-200
                    dark:border-gray-700
                    rounded-xl
                    p-5
                    shadow-sm
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                      mb-3
                    "
                  >
                    <div className="min-w-0">
                      <h4
                        className="
                          font-bold
                          text-gray-900
                          dark:text-gray-50
                          break-words
                        "
                      >
                        {node.label}
                      </h4>
                      <span
                        className="
                          inline-block
                          mt-2
                          px-2
                          py-1
                          rounded
                          text-xs
                          font-semibold
                          bg-blue-100
                          dark:bg-blue-900/40
                          text-blue-800
                          dark:text-blue-300
                        "
                      >
                        {node.technology}
                      </span>
                    </div>
                    <span
                      className="
                        flex-shrink-0
                        text-xs
                        font-medium
                        px-2
                        py-1
                        rounded
                        bg-gray-100
                        dark:bg-gray-700
                        text-gray-600
                        dark:text-gray-300
                      "
                    >
                      {node.type}
                    </span>
                  </div>
                  <p
                    className="
                      text-sm
                      text-gray-700
                      dark:text-gray-300
                      leading-relaxed
                      break-words
                    "
                  >
                    {node.role}
                  </p>
                  {node.why && (
                    <div
                      className="
                        mt-4
                        pt-3
                        border-t
                        border-gray-200
                        dark:border-gray-700
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-semibold
                          text-gray-500
                          dark:text-gray-400
                          mb-1
                        "
                      >
                        Why?
                      </p>
                      <p
                        className="
                          text-sm
                          text-gray-600
                          dark:text-gray-400
                          leading-relaxed
                          break-words
                        "
                      >
                        {node.why}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Flow */}
        {flow.length > 0 && (
          <section>
            <h3
              className="
                text-xl
                font-bold
                text-gray-900
                dark:text-gray-50
                mb-4
              "
            >
              Request & Data Flow
            </h3>
            <div className="space-y-3">
              {flow.map((step, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-start
                    gap-4
                    bg-white
                    dark:bg-gray-800
                    border
                    border-gray-200
                    dark:border-gray-700
                    rounded-xl
                    p-4
                    sm:p-5
                    shadow-sm
                  "
                >
                  <div
                    className="
                      flex-shrink-0
                      w-8
                      h-8
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-100
                      dark:bg-blue-900/40
                      text-blue-700
                      dark:text-blue-300
                      font-bold
                      text-sm
                    "
                  >
                    {index + 1}
                  </div>
                  <p
                    className="
                      text-sm
                      sm:text-base
                      text-gray-700
                      dark:text-gray-300
                      leading-relaxed
                      break-words
                    "
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Decisions */}
        {decisions.length > 0 && (
          <section>
            <h3
              className="
                text-xl
                font-bold
                text-gray-900
                dark:text-gray-50
                mb-4
              "
            >
              Architecture Decisions
            </h3>
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >
              {decisions.map(
                (decision, index) => (
                  <div
                    key={index}
                    className="
                      bg-white
                      dark:bg-gray-800
                      border
                      border-gray-200
                      dark:border-gray-700
                      rounded-xl
                      p-5
                      shadow-sm
                    "
                  >
                    <h4
                      className="
                        font-bold
                        text-gray-900
                        dark:text-gray-50
                        mb-2
                      "
                    >
                      {decision.decision}
                    </h4>
                    <p
                      className="
                        text-sm
                        text-gray-600
                        dark:text-gray-400
                        leading-relaxed
                        break-words
                      "
                    >
                      {decision.reason}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}
        {/* Tradeoffs */}
        {tradeoffs && (
          <section>
            <h3
              className="
                text-xl
                font-bold
                text-gray-900
                dark:text-gray-50
                mb-4
              "
            >
              Trade-offs
            </h3>
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >
              {/* Pros */}
              {tradeoffs.pros?.length > 0 && (
                <div
                  className="
                    bg-green-50
                    dark:bg-green-900/20
                    border
                    border-green-200
                    dark:border-green-800
                    rounded-xl
                    p-5
                  "
                >
                  <h4
                    className="
                      font-bold
                      text-green-800
                      dark:text-green-300
                      mb-3
                    "
                  >
                    Advantages
                  </h4>
                  <ul className="space-y-2">
                    {tradeoffs.pros.map(
                      (pro, index) => (
                        <li
                          key={index}
                          className="
                            text-sm
                            text-green-900
                            dark:text-green-200
                            leading-relaxed
                          "
                        >
                          ✓ {pro}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {/* Cons */}
              {tradeoffs.cons?.length > 0 && (
                <div
                  className="
                    bg-red-50
                    dark:bg-red-900/20
                    border
                    border-red-200
                    dark:border-red-800
                    rounded-xl
                    p-5
                  "
                >
                  <h4
                    className="
                      font-bold
                      text-red-800
                      dark:text-red-300
                      mb-3
                    "
                  >
                    Limitations
                  </h4>
                  <ul className="space-y-2">
                    {tradeoffs.cons.map(
                      (con, index) => (
                        <li
                          key={index}
                          className="
                            text-sm
                            text-red-900
                            dark:text-red-200
                            leading-relaxed
                          "
                        >
                          • {con}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
            {tradeoffs.cost && (
              <div
                className="
                  mt-4
                  text-sm
                  text-gray-600
                  dark:text-gray-400
                "
              >
                Estimated complexity / cost:{' '}
                <span
                  className="
                    font-semibold
                    text-gray-900
                    dark:text-gray-200
                  "
                >
                  {tradeoffs.cost}
                </span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
/* ====================================================== */
/* FLOW TAB */
/* ====================================================== */
function FlowTab({ diagram }) {
  const flow = Array.isArray(diagram?.flow)
    ? diagram.flow
    : [];
  return (
    <div
      className="
        w-full
        p-4
        sm:p-6
        lg:p-8
      "
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-gray-900
            dark:text-gray-50
            mb-2
          "
        >
          Request & Data Flow
        </h2>
        <p
          className="
            text-gray-600
            dark:text-gray-400
            mb-6
            leading-relaxed
          "
        >
          Step-by-step explanation of how data
          moves through the architecture.
        </p>
        {flow.length === 0 ? (
          <div
            className="
              text-gray-500
              dark:text-gray-400
            "
          >
            No flow information available.
          </div>
        ) : (
          <div className="space-y-4">
            {flow.map((step, index) => (
              <div
                key={index}
                className="
                  flex
                  items-start
                  gap-4
                  bg-white
                  dark:bg-gray-800
                  border
                  border-gray-200
                  dark:border-gray-700
                  rounded-xl
                  p-4
                  sm:p-5
                  shadow-sm
                "
              >
                <div
                  className="
                    flex-shrink-0
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-blue-600
                    text-white
                    font-bold
                  "
                >
                  {index + 1}
                </div>
                <p
                  className="
                    text-gray-700
                    dark:text-gray-300
                    leading-relaxed
                    pt-1
                    break-words
                  "
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
/* ====================================================== */
/* STAT CARD */
/* ====================================================== */
function StatCard({ label, value }) {
  return (
    <div
      className="
        bg-white
        dark:bg-gray-800
        border
        border-gray-200
        dark:border-gray-700
        rounded-xl
        p-4
        sm:p-5
        shadow-sm
      "
    >
      <p
        className="
          text-xs
          sm:text-sm
          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </p>
      <p
        className="
          text-2xl
          sm:text-3xl
          font-bold
          text-gray-900
          dark:text-gray-50
          mt-1
        "
      >
        {value}
      </p>
    </div>
  );
}